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
// todo: this job must collect all data by it's own
const startCraftByBlueprint = async (
    character,
    building,
    blueprintEntity,
    participants,
    resourcesMultiplier = 1,
    throwException = true
) => {
    try {
        checkPermissions(character, building);

        const
            resourcesLevel    = validateResourcesMultiplier(resourcesMultiplier),
            blueprint         = await blueprintEntity.blueprint,
            perksLevel        = await checkRequiredPerks(blueprint, character, building, participants),
            blueprintLevel    = defineBlueprintQuality(blueprintEntity),
            {quality: facilityLevel, facilitiesToUse} = checkRequiredFacilities(blueprint, building),
            requiredResources = checkRequiredResources(blueprint, building, resourcesMultiplier),
            craftingTime      = defineCraftingTime(blueprint, resourcesLevel, facilityLevel, perksLevel, blueprintLevel);

        // Create new craft process in building
        building.craft_processes.push({
            crafting_id: blueprint._id,
            crafting_by: "Blueprint",
            used_resources: requiredResources,
            resources_multiplier: resourcesMultiplier,
            creator_character_id: character._id,
            crafting_characters: participants,
            crafting_facilities: facilitiesToUse,
            finish_at: moment().add(craftingTime * 60, "minutes").toDate(),
        });

        // Take the specified amount of resources from building's storage
        await building.editResources(invertResources(requiredResources));
        return true;
    } catch (error) {
        if (throwException) throw error;
        return false
    }
}

// Check whether character has permission to start the craft process in specific building
const checkPermissions = (character, building) => {
    if (character.fraction_id.equals(building.fraction_id) || character._id.equals(building.character_id)) {
        return true;
    }
    throw new Error("Character doesn't have access to building")
}

const validateResourcesMultiplier = (multiplier) => {
    switch (multiplier) {
        case 0.5: return POOR_LEVEL;
        case 1:   return BASIC_LEVEL;
        case 1.5: return SOLID_LEVEL;
        case 3:   return COMPLEX_LEVEL;
        default: throw new Error("Received incorrect resources multiplier");
    }
}

// Check whether building has all required facilities (at least for poor quality level) in it
const checkRequiredFacilities = (blueprint, building) => {
    const freeFacilities     = building.free_facilities;
    const requiredFacilities = blueprint.required_facilities;

    if (requiredFacilities.length === 0) {
        return {"quality": BASIC_LEVEL, "facilitiesToUse": []};
    }
    let qualityLevel = -1;
    let facilitiesToUse = []

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
                    if (qualityLevel < POOR_LEVEL) qualityLevel = POOR_LEVEL;
                    facilitiesToUse = availableFacilities.values()
                    break
                }
                case "basic": {
                    if (qualityLevel < BASIC_LEVEL) qualityLevel = BASIC_LEVEL;
                    facilitiesToUse = availableFacilities.values()
                    break
                }
                case "solid": {
                    if (qualityLevel < SOLID_LEVEL) qualityLevel = SOLID_LEVEL;
                    facilitiesToUse = availableFacilities.values()
                    break
                }
                case "complex": {
                    qualityLevel = COMPLEX_LEVEL;
                    facilitiesToUse = availableFacilities.values()
                    return
                }
            }
        }
    })

    if (qualityLevel >= 0) return {"quality": qualityLevel, "facilitiesToUse": facilitiesToUse};
    throw new Error("Building doesn't have enough of free required facilities");
}

// Check whether building has enough of resources
const checkRequiredResources = (blueprint, building, multiplier) => {
    const requiredResources = blueprint.required_resources.slice();

    // Use multiplier on resources
    requiredResources.map(function (resource, key) {
        this[key].amount *= multiplier
    }, requiredResources);

    // Will throw exception if building doesn't have enough of resources
    building.hasResources(requiredResources);

    return requiredResources
}

// Check whether defined participants has required perks and validate them
const checkRequiredPerks = async (blueprint, character, building, participants) => {
    // todo: add support of non-fraction members
    if (building.fraction_id !== null) {
        // All participants must be fraction members + must be free (don't participate in other crafts)
        const fraction    = await building.fraction;
        const freeMembers = await fraction.free_members;
        participants.map((participantId) => {
            if (!freeMembers.includes(participantId)) {
                throw new Error("One of defined participants is busy")
            }
        })
    } else {
        // Only building owner can participate in craft
        if (participants.length > 1 || (participants[0] !== undefined && participants[0] !== character._id)) {
            throw new Error("Only owner of the building can participate in craft")
        }
    }

    if (blueprint.required_perks.length === 0) return COMPLEX_LEVEL;

    // Check whether defined participants have required perks
    let availablePerks = [];
    participants.some(async (participantId) => {
        if (availablePerks.length === blueprint.required_perks.length) return;
        (await model("Character").findById(participantId)).perks.some((perk) => {
            if (!availablePerks.includes(perk) && blueprint.required_perks.includes(perk)) {
                availablePerks.push(perk);
                if (availablePerks.length === blueprint.required_perks.length) return;
            }
        })
    })

    const percentageOfAvailable = availablePerks.length / blueprint.required_perks.length;
    if (percentageOfAvailable >= 0.75) return COMPLEX_LEVEL;
    if (percentageOfAvailable >= 0.50) return SOLID_LEVEL;
    if (percentageOfAvailable >= 0.25) return BASIC_LEVEL;
    return POOR_LEVEL;
}

// Define quality level of blueprint by it's elaboration level
const defineBlueprintQuality = (blueprintEntity) => {
    if (blueprintEntity.quality <= 7)  return POOR_LEVEL;
    if (blueprintEntity.quality <= 14) return BASIC_LEVEL;
    if (blueprintEntity.quality <= 19) return SOLID_LEVEL;
    return COMPLEX_LEVEL;
}

// Define how long specific item will be crafting by checked characteristics (blueprint quality, perks traits, ...)
const defineCraftingTime = (blueprint, resourcesLevel, facilityLevel, perksLevel, blueprintLevel) => {
    return (resourcesLevel + facilityLevel + perksLevel + blueprintLevel) * blueprint.time_multiplier
}


const cancelCraft = (craftProcess, force = false) => {

}

const finishCraft = (craftProcess, force = false) => {

}

module.exports.startByBlueprint = startCraftByBlueprint;
module.exports.cancelCraft      = cancelCraft;
module.exports.finishCraft      = finishCraft;