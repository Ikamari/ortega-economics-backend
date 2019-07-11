// Helpers
const { invertResources } = require("../helpers/ResourcesHelper");
// Moment
const moment = require("moment")

// "Quality" levels
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

    // Check whether character has permission to start the craft process in specific building
    checkAccessToBuilding() {
        if (
            this.character.fraction_id.equals(this.building.fraction_id) ||
            this.character._id.equals(this.building.character_id)
        ) {
            return true;
        }
        throw new Error("Character doesn't have access to building")
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
    checkRequiredFacilities() {
        const freeFacilities     = this.building.free_facilities;
        const requiredFacilities = this.craftingBy === "Blueprint" ? this.blueprint.required_facilities : this.recipe.required_facilities;

        if (requiredFacilities.length === 0) {
            this.facilitiesLevel = BASIC_LEVEL;
            return;
        }

        if (this.craftingBy === "Recipe") {
            freeFacilities.some((facility) => {
                if (requiredFacilities.includes(facility.facility_type_id)) {
                    this.facilitiesToUse.push(facility._id)
                }
            })
            if (this.facilitiesToUse.length > 0) return;
            throw new Error("Building doesn't have enough of free required facilities");
        }

        requiredFacilities.some((requirement) => {
            let availableFacilities = {}; // Used to skip repeating facilities of same type
            freeFacilities.some((facility) => {
                if (requiredFacilities.includes(facility.facility_type_id) && !facility.facility_type_id in availableFacilities) {
                    availableFacilities[facility.facility_type_id] = facility._id
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
                        return
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
                if (!freeMembers.includes(participantId)) {
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
        this.participants.some(async (participantId) => {
            if (availablePerks.length === this.blueprint.required_perks.length) return;

            (await model("Character").findById(participantId)).perks.some((perk) => {
                if (!availablePerks.includes(perk) && this.blueprint.required_perks.includes(perk)) {
                    availablePerks.push(perk);
                    if (availablePerks.length === this.blueprint.required_perks.length) return;
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
            this.blueprint.time_multiplier * (this.resourcesLevel + this.facilityLevel + this.perksLevel + this.blueprintLevel) :
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
            crafting_id:          this.blueprint._id,
            crafting_by:          this.craftingBy,
            quantity:             this.quantity,
            used_resources:       this.requiredResources,
            resources_multiplier: this.resourcesMultiplier,
            creator_character_id: this.character._id,
            crafting_characters:  this.participants,
            crafting_facilities:  this.facilitiesToUse,
            finish_at: moment().add(this.craftingTime * 60, "minutes").toDate(),
        });
    }

    async craftByBlueprint(blueprintEntity, participants = [], resourcesMultiplier = 1, throwException = true) {
        try {
            this.checkAccessToBuilding();

            this.craftingBy          = "Blueprint";
            this.participants        = participants;
            this.resourcesMultiplier = resourcesMultiplier;
            this.checkResourcesMultiplier();

            this.blueprint       = await blueprintEntity.blueprint;
            this.blueprintEntity = blueprintEntity;

            await this.checkRequiredPerks();
            this.defineBlueprintQuality();
            this.checkRequiredFacilities();
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

            this.checkRequiredFacilities();
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

const startCraftByBlueprint = (character, building, blueprintEntity, participants = [], resourcesMultiplier = 1, throwException = true) => {
    return (new CraftProcessCreator(character, building)).craftByBlueprint(blueprintEntity, participants, resourcesMultiplier, throwException)
}

const startCraftByRecipe = (character, building, recipe, quantity = 1, throwException = true) => {
    return (new CraftProcessCreator(character, building)).craftByRecipe(recipe, quantity, throwException)
}

const cancelCraft = (character, building, craftProcess, force = false) => {

}

const finishCraft = (character, building, craftProcess, force = false) => {

}

module.exports.startByBlueprint = startCraftByBlueprint;
module.exports.startByRecipe    = startCraftByRecipe;
module.exports.cancel           = cancelCraft;
module.exports.finish           = finishCraft;