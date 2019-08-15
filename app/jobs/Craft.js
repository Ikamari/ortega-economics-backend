// Database
const { model } = require("mongoose");
// Helpers
const { invertResources } = require("../helpers/ResourcesHelper");
const { hasObjectId } = require("../helpers/ObjectIdHelper");
// Moment
const moment = require("moment");
// Models
const { getFacilitiesMap } = require("../models/Facility");
const { STATUS_IDS: craftProcessStatusIds } = require("../models/schemas/CraftProcess");

// Quality levels
const
    POOR_LEVEL    = 0,
    BASIC_LEVEL   = 0.25,
    SOLID_LEVEL   = 0.55,
    COMPLEX_LEVEL = 0.95;

// todo: prevent duplicates of participants
class CraftProcessCreator {

    constructor(character, building) {
        this.character         = character;
        this.building          = building;
        this.participants      = [];
        this.facilitiesToUse   = [];
        this.requiredResources = [];

        this.recipe          = null;
        this.blueprint       = null;
        this.blueprintEntity = null;

        this.quantity            = 1;
        this.resourcesMultiplier = 1;
        this.craftingBy          = null; // Currently can by "Recipe" or "Blueprint"
        this.craftingTime        = 0; // In minutes

        // Properties below will be used in craft by blueprint
        this.resourcesLevel  = null;
        this.facilitiesLevel = null;
        this.perksLevel      = null;
        this.blueprintLevel  = null;
    }

    checkAccessToBuilding() {
        return checkAccessToBuilding(this.character, this.building);
    }

    checkResourcesMultiplier() {
        switch (this.resourcesMultiplier) {
            case 0.5: this.resourcesLevel = POOR_LEVEL;    break;
            case 1:   this.resourcesLevel = BASIC_LEVEL;   break;
            case 1.5: this.resourcesLevel = SOLID_LEVEL;   break;
            case 3:   this.resourcesLevel = COMPLEX_LEVEL; break;
            default: throw new Error("Received incorrect resources multiplier");
        }
    }

    // Check whether building has all required facilities (at least for poor quality level) in it
    async checkRequiredFacilities() {
        const freeFacilities = this.building.free_facilities;
        const requiredFacilities = this.craftingBy === "Blueprint" ? this.blueprint.required_facilities : [];
        const requiredFacilityTypeId = this.craftingBy === "Recipe" ? this.recipe.required_facility_type_id : null;

        if (this.craftingBy === "Blueprint" && requiredFacilities.length === 0) {
            this.facilitiesLevel = BASIC_LEVEL;
            return;
        } else if (this.craftingBy === "Recipe" && requiredFacilityTypeId === null) {
            return;
        }

        // todo: Check facility type id as object id
        if (this.craftingBy === "Recipe") {
            const facilitiesMap = await getFacilitiesMap("_id");
            freeFacilities.some((facility) => {
                if (requiredFacilityTypeId === facilitiesMap[facility.facility_id.toString()].type_id) {
                    this.facilitiesToUse.push(facility._id);
                    return true;
                }
            })
            if (this.facilitiesToUse.length > 0) return;
            throw new Error("Building doesn't have free facility of required type");
        }

        requiredFacilities.some((requirement) => {
            let availableFacilities = {}; // Used to skip repeating facilities of same type
            freeFacilities.some((facility) => {
                if (requiredFacilities.includes(facility.facility_id) && !facility.facility_id in availableFacilities) {
                    availableFacilities[facility.facility_id] = facility._id
                }
            })

            if (Object.keys(availableFacilities).length === freeFacilities.length) {
                switch (requirement.quality_level) {
                    case "poor": {
                        if (this.facilitiesLevel < POOR_LEVEL) {
                            this.facilitiesLevel = POOR_LEVEL;
                            this.facilitiesToUse = availableFacilities.values()
                        }
                        break
                    }
                    case "basic": {
                        if (this.facilitiesLevel < BASIC_LEVEL) {
                            this.facilitiesLevel = BASIC_LEVEL;
                            this.facilitiesToUse = availableFacilities.values()
                        }
                        break
                    }
                    case "solid": {
                        if (this.facilitiesLevel < SOLID_LEVEL) {
                            this.facilitiesLevel = SOLID_LEVEL;
                            this.facilitiesToUse = availableFacilities.values()
                        }
                        break
                    }
                    case "complex": {
                        this.facilitiesLevel = COMPLEX_LEVEL;
                        this.facilitiesToUse = availableFacilities.values()
                        return true;
                    }
                }
            }
        })

        if (this.facilitiesLevel === null) {
            throw new Error("Building doesn't have enough of free required facilities");
        }
    }

    // Check whether defined participants has required perks and validate them
    async checkRequiredPerks() {
        // todo: add support of non-fraction members
        if (this.building.fraction_id !== null) {
            // All participants must be fraction members + must be free (don't participate in other crafts)
            const fraction    = await this.building.fraction;
            const freeMembers = await fraction.free_members;
            this.participants.map((participantId) => {
                const isFree = freeMembers.filter(freeMember => {
                    return freeMember._id.toString() === participantId
                }).length !== 0
                if (!isFree) {
                    throw new Error("One of defined participants is busy")
                }
            })
        } else {
            // Only building owner can participate in craft
            if (this.participants.length > 1 || (this.participants[0] !== undefined && this.participants[0] !== this.character._id)) {
                throw new Error("Only owner of the building can participate in craft")
            }
        }

        if (this.blueprint.required_perks.length === 0) return COMPLEX_LEVEL;

        // Check whether defined participants have required perks
        let availablePerks = [];
        const characters = await model("Character").find({"_id": { $in: this.participants }});
        characters.some((character) => {
            if (availablePerks.length === this.blueprint.required_perks.length) return true;
            character.perks.some((perk) => {
                if (!hasObjectId(availablePerks, perk) && hasObjectId(this.blueprint.required_perks, perk)) {
                    availablePerks.push(perk);
                    if (availablePerks.length === this.blueprint.required_perks.length) return true;
                }
            })
        })

        const percentageOfAvailable = availablePerks.length / this.blueprint.required_perks.length;
        if (percentageOfAvailable >= 0.75) this.perksLevel = COMPLEX_LEVEL;
        else if (percentageOfAvailable >= 0.50) this.perksLevel = SOLID_LEVEL;
        else if (percentageOfAvailable >= 0.25) this.perksLevel = BASIC_LEVEL;
        else this.perksLevel = POOR_LEVEL;
    }

    // Define quality level of blueprint by it's elaboration level
    defineBlueprintQuality() {
        if (this.blueprintEntity.quality <= 7) this.blueprintLevel = POOR_LEVEL;
        else if (this.blueprintEntity.quality <= 14) this.blueprintLevel = BASIC_LEVEL;
        else if (this.blueprintEntity.quality <= 19) this.blueprintLevel = SOLID_LEVEL;
        else this.blueprintLevel = COMPLEX_LEVEL;
    }

    // Define how long specific item will be crafting by checked characteristics (blueprint quality, perks traits, ...)
    defineCraftingTime() {
        this.craftingTime = this.craftingBy === "Blueprint" ?
            60 * (this.blueprint.time_multiplier * (this.resourcesLevel + this.facilitiesLevel + this.perksLevel + this.blueprintLevel)) :
            this.recipe.craft_time * this.quantity
    }

    // Check whether building has enough of resources
    checkRequiredResources() {
        this.requiredResources = (this.craftingBy === "Blueprint" ? this.blueprint : this.recipe).required_resources.slice();
        const multiplier       = this.craftingBy === "Blueprint" ? this.resourcesMultiplier : this.quantity;

        // Use multiplier on resources
        this.requiredResources.map(function (resource, key) {
            this[key].amount *= multiplier
        }, this.requiredResources);

        // Will throw exception if building doesn't have enough of resources
        this.building.hasResources(this.requiredResources);
    }

    createCraftProcess() {
        this.building.craft_processes.push({
            crafting_id:          this.craftingBy === "Blueprint" ? this.blueprint._id : this.recipe._id,
            blueprint_entity_id:  this.craftingBy === "Blueprint" ? this.blueprintEntity._id : null,
            crafting_by:          this.craftingBy,
            quantity:             this.quantity,
            quality:              this.craftingBy === "Blueprint" ? (this.resourcesLevel + this.facilitiesLevel + this.perksLevel + this.blueprintLevel) : null,
            // Clone current state of required resources to prevent saving unexpected changes
            used_resources:       JSON.parse(JSON.stringify(this.requiredResources)),
            resources_multiplier: this.resourcesMultiplier,
            creator_character_id: this.character._id,
            crafting_fraction_id: this.building.fraction_id,
            crafting_characters:  this.participants,
            crafting_facilities:  this.facilitiesToUse,
            finish_at: moment().add(this.craftingTime, "minutes").toDate()
        });
    }

    async craftByBlueprint(blueprintEntity, participants = [], resourcesMultiplier = 1, throwException = true) {
        try {
            this.checkAccessToBuilding();

            this.craftingBy          = "Blueprint";
            this.participants        = [...new Set(participants)]; // Get rid of duplicates
            this.resourcesMultiplier = resourcesMultiplier;
            this.checkResourcesMultiplier();

            this.blueprint       = await blueprintEntity.blueprint;
            this.blueprintEntity = blueprintEntity;

            await this.checkRequiredPerks();
            this.defineBlueprintQuality();
            await this.checkRequiredFacilities();
            this.checkRequiredResources();
            this.defineCraftingTime();

            // Create new craft process in building
            this.createCraftProcess();

            // Take the specified amount of resources from building's storage
            await this.building.editResources(invertResources(this.requiredResources));

            return true;
        }
        catch (error) {
            if (throwException) throw error;
            return false
        }
    }

    async craftByRecipe(recipe, quantity = 1, throwException = true) {
        try {
            this.checkAccessToBuilding();

            this.craftingBy = "Recipe";
            this.recipe     = recipe;
            this.quantity   = quantity;

            await this.checkRequiredFacilities();
            this.checkRequiredResources();
            this.defineCraftingTime();

            // Create new craft process in building
            this.createCraftProcess();

            // Take the specified amount of resources from building's storage
            await this.building.editResources(invertResources(this.requiredResources));

            return true;
        }
        catch (error) {
            if (throwException) throw error;
            return false
        }
    }

}

// Check whether character has permission to start the craft process in specific building
const checkAccessToBuilding = (character, building) => {
    if (character.fraction_id.equals(building.fraction_id) || character._id.equals(building.character_id)) {
        return true;
    }
    throw new Error("Character doesn't have access to building")
}

// Check whether character has permission to the craft process
const checkAccessToCraftProcess = (character, craftProcess) => {
    if (character.fraction_id.equals(craftProcess.crafting_fraction_id) || character._id.equals(craftProcess.creator_character_id)) {
        return true;
    }
    throw new Error("Character doesn't have access to the craft process")
}

const startCraftByBlueprint = (character, building, blueprintEntity, participants = [], resourcesMultiplier = 1, throwException = true) => {
    return (new CraftProcessCreator(character, building)).craftByBlueprint(blueprintEntity, participants, resourcesMultiplier, throwException)
}

const startCraftByRecipe = (character, building, recipe, quantity = 1, throwException = true) => {
    return (new CraftProcessCreator(character, building)).craftByRecipe(recipe, quantity, throwException)
}

const cancelCraft = async (character, building, craftProcess, force = false, throwException = true) => {
    try {
        if (!force) {
            // Character must have access to the building
            checkAccessToBuilding(character, building)

            if (craftProcess.finish_at <= Date.now()) {
                throw new Error("Craft process cannot be cancelled after craft time has passed")
            }
        }

        if (craftProcess.is_finished) {
            throw new Error("Craft process was already finished or cancelled")
        }

        // Return resources to the building
        await building.editResources(craftProcess.used_resources)

        // Mark craft process as cancelled
        craftProcess.is_finished = true;
        craftProcess.status_id = craftProcessStatusIds[force ? "Cancelled" : "Cancelled (Forced)"];
        await building.save();

        return true
    } catch (e) {
        if (throwException) throw e;
        return false;
    }
}

const finishCraft = async (character, building, craftProcess, force = false, throwException = true) => {
    try {
        if (!force) {
            // Character must have access to the building
            checkAccessToBuilding(character, building)

            if (craftProcess.finish_at > Date.now()) {
                throw new Error("Craft process cannot be finished before craft time has passed")
            }
        }

        if (craftProcess.is_finished) {
            throw new Error("Craft process was already finished or cancelled")
        }

        switch (craftProcess.crafting_by) {
            case "Recipe": {
                // Add crafted resources to the building
                const recipe = await model("Recipe").findById(craftProcess.crafting_id);
                await building.editResources([{
                    _id: recipe.resource_id,
                    amount: craftProcess.quantity * recipe.amount
                }])
                break;
            }
            case "Blueprint": {
                if (force) {
                    throw new Error("Craft by blueprint cannot be forcefully finished")
                }
                // Increase quality level of blueprint entity
                const blueprintEntity = await model("BlueprintEntity").findById(craftProcess.blueprint_entity_id);
                blueprintEntity.quality += 1;
                await blueprintEntity.save();

                // todo: Request MC server to give crafted item
                break;
            }
            default: throw new Error("Trying to process unknown type of craft process")
        }

        // Mark craft process as finished
        craftProcess.is_finished = true;
        craftProcess.status_id = craftProcessStatusIds[force ? "Finished" : "Finished (Forced)"];
        await building.save();

        return true;
    } catch (e) {
        if (throwException) throw e;
        return false;
    }
}

module.exports.startByBlueprint = startCraftByBlueprint;
module.exports.startByRecipe    = startCraftByRecipe;
module.exports.cancel           = cancelCraft;
module.exports.finish           = finishCraft;