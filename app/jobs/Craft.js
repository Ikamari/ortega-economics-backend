// Database
const { model } = require("mongoose");
// Helpers
const { invertResources } = require("../helpers/ResourcesHelper");
const { hasObjectId } = require("../helpers/ObjectIdHelper");
// Moment
const moment = require("moment");
// Models
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
        this.craftingBy          = null; // Currently can be "Recipe" or "Blueprint"
        this.craftingTime        = 0;    // In minutes
        this.tech_tier_bonus     = 0;

        this.resourcesLevel  = 0;
        this.facilitiesLevel = 0;
        this.perksLevel      = 0;
        this.blueprintLevel  = 0;
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

    // Check whether building has all required facilities
    // todo: refactor me (repeating code)
    async checkRequiredFacilities() {
        const freeFacilities = this.building.freeFacilities(null, "tech_tier", "DESC");

        if (this.craftingBy === "Recipe") {
            // Skip check of required facility if recipe doesn't have it
            if (!this.recipe.required_facility_type_id) return;

            // Check whether building has suitable free facilities
            const hasFacility = freeFacilities.some((freeFacility) => {
                if (
                    this.recipe.required_facility_type_id.equals(freeFacility.properties.type_id) &&
                    this.recipe.tech_tier <= freeFacility.properties.tech_tier
                ) {
                    this.facilitiesToUse.push(freeFacility._id);
                    this.tech_tier_bonus = freeFacility.properties.tech_tier - this.recipe.tech_tier;
                    return true;
                }
            });

            if (!hasFacility) return;
            throw new Error("Building doesn't have free facility of required type");
        }

        const requiredFacilities = this.blueprint.required_facilities;
        // Skip check of required facilities if blueprint doesn't have them
        if (requiredFacilities.length === 0) {
            this.facilitiesLevel = BASIC_LEVEL;
            return;
        }

        const hasFacility = requiredFacilities.some((requiredFacility) => {
            const hasFacility = freeFacilities.some((freeFacility) => {
                if (
                    requiredFacility.type_id.equals(freeFacility.properties.type_id) &&
                    requiredFacility.tech_tier <= freeFacility.properties.tech_tier
                ) {
                    this.facilitiesToUse.push(freeFacility._id.toString());
                    this.facilitiesLevel += increaseQualityLevel(
                        freeFacility.properties.quality_level,
                        freeFacility.properties.tech_tier - requiredFacility.tech_tier
                    );
                    return true;
                }
            });
            if (hasFacility) return true;
        })

        if (!hasFacility) throw new Error("Building doesn't have free facility of required type");
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
        if (this.craftingBy === "Recipe") {
            this.craftingTime = this.recipe.craft_time * this.quantity;
            // Decrease crafting time if craft process is using facility with tech tier higher than required
            if (this.tech_tier_bonus === 1) this.craftingTime *= 0.80;
            else if (this.tech_tier_bonus > 1) this.craftingTime *= 0.50;
            return;
        }
        this.craftingTime = 60 * (this.blueprint.difficulty * (this.resourcesLevel + this.facilitiesLevel + this.perksLevel + this.blueprintLevel));
    }

    // Check whether building has enough of resources
    checkRequiredResources() {
        this.requiredResources = (this.craftingBy === "Blueprint" ? this.blueprint : this.recipe).required_resources.slice();
        const multiplier = this.craftingBy === "Blueprint" ? this.resourcesMultiplier : this.quantity;

        // Use multiplier on resources
        this.requiredResources.map(function (resource, key) {
            this[key].amount *= multiplier
        }, this.requiredResources);

        // Will throw exception if building doesn't have enough of resources
        this.building.hasResources(this.requiredResources);
    }

    createCraftProcess() {
        const qualityLevel = this.resourcesLevel + this.facilitiesLevel + this.perksLevel + this.blueprintLevel;
        // Craft cannot be started if quality level is too low
        if (qualityLevel < BASIC_LEVEL) throw new Error("Overall quality is too low");

        this.building.craft_processes.push({
            crafting_id:          this.craftingBy === "Blueprint" ? this.blueprint._id : this.recipe._id,
            blueprint_entity_id:  this.craftingBy === "Blueprint" ? this.blueprintEntity._id : null,
            crafting_by:          this.craftingBy,
            quantity:             this.quantity,
            quality_level:        this.craftingBy === "Blueprint" ? qualityLevel : null,
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

// todo: figure out whether there's a better way to do it
const increaseQualityLevel = (qualityLevel, times = 1) => {
    let increasedTimes = 0, increasedQualityLevel = qualityLevel;
    while (increasedTimes < times) {
        if (increasedQualityLevel < BASIC_LEVEL) increasedQualityLevel = BASIC_LEVEL;
        else if (BASIC_LEVEL <= increasedQualityLevel < SOLID_LEVEL) increasedQualityLevel = SOLID_LEVEL
        else if (SOLID_LEVEL <= increasedQualityLevel < COMPLEX_LEVEL) increasedQualityLevel = COMPLEX_LEVEL;
        else return increasedQualityLevel
    }
    return increasedQualityLevel;
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