// Database
const { Schema, Types, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Helpers
const { mergeResources, sortResources, invertResources, filterWithNegativeAmount } = require("../helpers/ResourcesHelper");
const { hasObjectId } = require("../helpers/ObjectIdHelper");
const moment = require("moment");
// Validators
const { exists } = require("../validators/General");
// Schemas
const FacilityEntitySchema = require("./schemas/FacilityEntity");
const CraftProcessSchema = require("./schemas/CraftProcess");
// Exception
const ErrorResponse = require("@controllers/ErrorResponse");

const ResourceTurnoverSchema = new Schema({
    resource_id: {
        validate: exists("Resource"),
        type: Schema.Types.ObjectId,
        required: true
    },
    chance: {
        type: Number,
        required: true,
        default: 0,
        max: 1,
        min: 0
    },
    amount: {
        type: Int32,
        required: true,
        default: 0,
        min: 0
    }
});

const BuildingSchema = new Schema({
    fraction_id: {
        type: Schema.Types.ObjectId,
        validate: exists("Fraction"),
        default: null
    },
    money: {
        type: Int32,
        required: true,
        default: 0
    },
    character_id: {
        type: Schema.Types.ObjectId,
        validate: exists("Character"),
        default: null
    },
    name: {
        type: String,
        required: true,
        default: "Unnamed"
    },
    available_workplaces: {
        type: Int32,
        required: true,
        default: 0
    },
    used_workplaces: {
        type: Int32,
        required: true,
        default: 0
    },
    used_workplaces_by_phantoms:{
        type: Int32,
        required: true,
        default: 0
    },
    food_consumption: {
        type: Int32,
        required: true,
        default: 1
    },
    water_consumption: {
        type: Int32,
        required: true,
        default: 1
    },
    money_consumption: {
        type: Int32,
        required: true,
        default: 0
    },
    storage_size: {
        type: Int32,
        required: true,
        default: 0,
        min: 0
    },
    used_storage: {
        type: Int32,
        required: true,
        default: 0,
        min: 0
    },
    resources: {
        type: Map,
        of: Int32,
        validate: exists("Resource"),
        required: true,
        default: {},
    },
    facilities: {
        type: [FacilityEntitySchema],
        required: true,
        default: []
    },
    produces: {
        type: [ResourceTurnoverSchema],
        required: true,
        default: []
    },
    consumes: {
        type: [ResourceTurnoverSchema],
        required: true,
        default: []
    },
    money_production: {
        type: Int32,
        required: true,
        default: 0
    },
    craft_processes: {
        type: [CraftProcessSchema],
        required: true,
        default: []
    },
    // finished_craft_processes: {
    //     type: [CraftProcessSchema],
    //     required: true,
    //     default: []
    // },
    is_active: {
        type: Boolean,
        required: true,
        default: false
    },
    energy_production: {
        type: Int32,
        required: true,
        min: 0,
        default: 0
    },
    // todo: energy consumption by the building?
    storage_priority: {
        type: Int32,
        required: true,
        default: 0
    },
    defense_level: {
        type: Int32,
        required: true,
        min: 0,
        default: 0
    }
});

BuildingSchema.pre("validate", async function(next) {
    if (this.used_workplaces + this.used_workplaces_by_phantoms > this.available_workplaces){
        return next(new ErrorResponse("Used workplaces amount cannot be higher than available workplaces amount"));     
    }
});

BuildingSchema.virtual("fraction").get(async function () {
    return await model("Fraction").findById({ _id: this.fraction_id });
});

BuildingSchema.virtual("free_facilities").get(function() {
    return this.freeFacilities();
});

BuildingSchema.virtual("energy_consumption").get(async function () {
    if (!this.populated("facilities.properties")) {
        await this.populate("facilities.properties").execPopulate();
    }

    let energyConsumption = 0;
    this.facilities.map((facility) => {
        if (facility.is_active) {
            energyConsumption += facility.properties.energy_consumption;
        }
    });

    return energyConsumption;
});

BuildingSchema.virtual("finished_craft_processes").get(function () {
    return this.getCraftProcesses(true);
});

BuildingSchema.virtual("unfinished_craft_processes").get(function () {
    return this.getCraftProcesses(false);
});

// Get overall info about free/consumed/produced energy in building
BuildingSchema.virtual("energy").get(function() {
    return new Promise((resolve, reject) => {
        this.populateFacilities().then(() => {
            let energyConsumption = 0;
            this.facilities.map((facility) => {
                if (facility.is_active) {
                    energyConsumption += facility.properties.energy_consumption;
                }
            });
            resolve({
                consumption: energyConsumption,
                production: this.energy_production,
                free: this.energy_production - energyConsumption
            });
        })
    })
});

// todo: use async-await
BuildingSchema.methods.hasEnergy = function(amountOfEnergy, doBlackoutOnFalse = false, rejectOnFalse = true) {
    return new Promise((resolve, reject) => {
        if (amountOfEnergy <= 0) {
            resolve(true)
        }
        else if (this.fraction_id) {
            // Check whether fraction has enough of energy
            this.fraction.then((fraction) =>
                fraction.hasEnergy(amountOfEnergy, doBlackoutOnFalse, rejectOnFalse)
                    .then((result) => resolve(result))
                    .catch((error) => reject(error))
            )
        } else {
            // Check whether building has enough of energy
            this.energy.then((buildingEnergyInfo) => {
                const result = buildingEnergyInfo.free >= amountOfEnergy;
                if (result || !rejectOnFalse || doBlackoutOnFalse) {
                    resolve(result)
                } else {
                    reject("Building doesn't have enough of energy")
                }
            })
        }
    })
};

BuildingSchema.methods.enable = function() {
    return new Promise((resolve, reject) => {
        if (this.is_active === true) resolve(true);

        // Check whether fraction/building has enough of energy
        if (this.fraction_id) {
            this.energy.then((buildingEnergyInfo) => {
                this.fraction.then((fraction) =>
                    fraction.hasEnergy(buildingEnergyInfo.consumption - buildingEnergyInfo.production)
                        .then(() => {
                            this.is_active = true;
                            this.save().then(() => resolve(true));
                        })
                        .catch((error) => reject(error))
                )
            })
        } else {
            // Get energy consumption of this building
            this.energy.then((buildingEnergyInfo) => {
                if (buildingEnergyInfo.free < 0) {
                    reject("Building doesn't have enough of energy")
                } else {
                    this.is_active = true;
                    this.save().then(() => resolve(true));
                }
            })
        }
    })
};

BuildingSchema.methods.disable = async function(isBlackout = false) {
    if (this.is_active === false) return true;

    if (this.fraction_id && !isBlackout) {
        const buildingEnergyInfo = await this.energy;
        const fraction           = await this.fraction;
        const fractionHasEnergy  = await fraction.hasEnergy(buildingEnergyInfo.consumption - buildingEnergyInfo.production, true);

        if (!fractionHasEnergy) return true;
    }

    // Stop all craft processes
    await this.stopAllCrafts();

    this.is_active = false;
    await this.save();
    return true;
};

//region - Ownership

BuildingSchema.methods.attachToFraction = async function(fractionId, enable = false) {
    // Detach from previous owner
    await this.detachFromOwner();
    this.fraction_id = fractionId;
    if (enable) await this.enable();
    return true;
};

BuildingSchema.methods.detachFromFraction = async function() {
    if (!this.fraction_id) return false;
    await this.disable();
    this.fraction_id = null;
    return true;
};

BuildingSchema.methods.attachToCharacter = async function(characterId, enable = false) {
    // Detach from previous owner
    await this.detachFromOwner();
    this.character_id = characterId;
    if (enable) await this.enable();
    return true;
};

BuildingSchema.methods.detachFromCharacter = async function() {
    if (!this.character_id) return false;
    await this.disable();
    this.character_id = null;
    return true;
};

BuildingSchema.methods.detachFromOwner = async function() {
    return await this.detachFromFraction() || await this.detachFromCharacter();
};

//endregion

//region - Resources

BuildingSchema.methods.hasResources = function(resourcesToFind, throwException = true) {
    const result = resourcesToFind.every((resourceToFind) => {
        return Math.abs(resourceToFind.amount) <= this.resources.get(resourceToFind._id.toString())
    });
    if (!result && throwException) throw new ErrorResponse("Building doesn't have enough of resources");
    return result;
};

BuildingSchema.methods.editResources = async function(resources, strictCheck = true, autoSave = true) {
    const transaction = sortResources(mergeResources(resources));
    this.hasResources(filterWithNegativeAmount(transaction));
    let newUsedStorage = this.used_storage;

    // Add or remove specified resources
    transaction.map((resource) => {
        const resourceId = resource._id.toString();

        if (this.resources.has(resourceId)) {
            this.resources.set(resourceId, this.resources.get(resourceId) + resource.amount)
        } else {
            this.resources.set(resourceId, resource.amount)
        }
        newUsedStorage += resource.amount;

        // If storage got overflowed and strict check is disabled, subtract part of resources to fit storage size
        if ((newUsedStorage > this.storage_size) && !strictCheck) {
            const amountToSubtract = newUsedStorage - this.storage_size;
            this.resources.set(resourceId, this.resources.get(resourceId) - amountToSubtract);
            newUsedStorage -= amountToSubtract
        }
    });

    // Storage mustn't be overflowed
    if (newUsedStorage > this.storage_size) {
        throw new ErrorResponse(`Storage will be overflowed (new: ${newUsedStorage}, max: ${this.storage_size})`);
    }

    // Used storage size cannot be negative
    if (newUsedStorage < 0) {
        throw new Error("Used storage size cannot be negative");
    }

    this.used_storage = newUsedStorage;
    if (autoSave) {
        await this.save();
    }
    return true
};

// todo: add and use autosave parameter
BuildingSchema.methods.editResource = function(resource, strictCheck = true, autoSave = true) {
    return this.editResources([resource], strictCheck, autoSave)
};

//endregion

//region - Facilities

BuildingSchema.methods.populateFacilities = async function() {
    if (!this.populated("facilities.properties")) {
        await this.populate("facilities.properties").execPopulate();
    }
};

BuildingSchema.methods.facilityIsFree = function(facilityEntity, filter = null) {
    if (!facilityEntity.is_active) return false;

    // Facility shouldn't be present in any active craft process
    let isFree = this.craft_processes.every((craftProcess) => {
        return !(!craftProcess.is_finished && hasObjectId(craftProcess.crafting_facilities, facilityEntity._id));
    });

    if (isFree && filter instanceof Function) {
        isFree = filter(facilityEntity);
    }

    return isFree;
};

BuildingSchema.methods.freeFacilities = function(filter = null, sortBy = null, sortDirection = "ASC") {
    if (this.populate() === undefined && (sortBy || filter)) {
        throw new Error("facilities.properties must be populated in order to use this method with sort or filter")
    }

    const freeFacilities = this.facilities.map((facility) => {
        if (this.facilityIsFree(facility, filter)) {
            return facility;
        }
    }).filter(facility => facility !== undefined);

    let direction;
    switch (sortDirection.toUpperCase()) {
        case "ASC":  direction = 1;  break;
        case "DESC": direction = -1; break;
        default: throw new Error("Trying to use incorrect sorting direction");
    }

    if (sortBy) {
        freeFacilities.sort((a, b) => {
            return ((a.properties[sortBy] > b.properties[sortBy]) ? 1 : ((b.properties[sortBy] > a.properties[sortBy]) ? -1 : 0)) * direction;
        });
    }

    return freeFacilities;
};

BuildingSchema.methods.addFacility = async function(facilityId, isActive = true) {
    const facility = await model("Facility").findById(facilityId);
    if (!facility) throw new ErrorResponse("Unable to find specified facility");

    const newFacilityEntity = {
        _id: Types.ObjectId(),
        facility_id: facilityId,
        is_active: false
    };

    if (isActive) {
        // Check whether fraction/building has enough of energy
        newFacilityEntity.is_active = await this.hasEnergy(facility.energy_consumption, false, false)
    }

    this.facilities.push(newFacilityEntity);
    this.save();
    return newFacilityEntity._id;
};

BuildingSchema.methods.enableFacility = async function(facilityEntityId) {
    const facilityEntity = this.facilities.id(facilityEntityId);
    if (!facilityEntity) throw new ErrorResponse("Unable to find specified facility entity");
    if (facilityEntity.is_active === true) return true;

    await this.populateFacilities();
    await this.hasEnergy(facilityEntity.properties.energy_consumption);
    facilityEntity.is_active = true;
    await this.save();
    return true;
};

BuildingSchema.methods.disableFacility = async function(facilityEntityId) {
    const facilityEntity = this.facilities.id(facilityEntityId);
    if (!facilityEntity) throw new ErrorResponse("Unable to find specified facility entity");
    if (facilityEntity.is_active === false) return true;

    if (!this.facilityIsFree(facilityEntity)) {
        throw new ErrorResponse(`Facility ${facilityEntityId} cannot be disabled. It's currently used in craft process`);
    }

    facilityEntity.is_active = false;
    await this.save();
    return true
};

BuildingSchema.methods.removeFacility = async function(facilityEntityId) {
    const facilityEntity = this.facilities.id(facilityEntityId);
    if (!facilityEntity) throw new ErrorResponse("Unable to find specified facility entity");

    if (!this.facilityIsFree(facilityEntity)) {
        throw new ErrorResponse(`Facility ${facilityEntityId} cannot be removed. It's currently used in craft process`);
    }

    facilityEntity.remove();
    await this.save();
    return true;
};

//endregion

//region - Production/Consumption of resources

BuildingSchema.methods.addProduction = function (resource_id, amount, chance, autoSave = true) {
    this.produces.push({
        resource_id: resource_id,
        amount:      amount,
        chance:      chance
    });
    return autoSave ? this.save() : true;
};

BuildingSchema.methods.removeProduction = function (turnoverId, autoSave = true) {
    const turnover = this.produces.id(turnoverId);
    if (!turnover) {
        throw new ErrorResponse("Can't find specified turnover")
    }
    turnover.remove();
    return autoSave ? this.save() : true;
};

BuildingSchema.methods.addConsumption = function (resource_id, amount, chance, autoSave = true) {
    this.consumes.push({
        resource_id: resource_id,
        amount:      amount,
        chance:      chance
    });
    return autoSave ? this.save() : true;
};

BuildingSchema.methods.removeConsumption = function (turnoverId, autoSave = true) {
    const turnover = this.consumes.id(turnoverId);
    if (!turnover) {
        throw new ErrorResponse("Can't find specified turnover")
    }
    turnover.remove();
    return autoSave ? this.save() : true;
};

//endregion

//region - Craft

const
    POOR_LEVEL    = 0,
    BASIC_LEVEL   = 0.25,
    SOLID_LEVEL   = 0.55,
    COMPLEX_LEVEL = 0.95;

const increaseQualityLevel = (qualityLevel, times = 1) => {
    let increasedTimes = 0, increasedQualityLevel = qualityLevel;
    while (increasedTimes < times) {
        if (increasedQualityLevel < BASIC_LEVEL) increasedQualityLevel = BASIC_LEVEL;
        else if (BASIC_LEVEL <= increasedQualityLevel < SOLID_LEVEL) increasedQualityLevel = SOLID_LEVEL;
        else if (SOLID_LEVEL <= increasedQualityLevel < COMPLEX_LEVEL) increasedQualityLevel = COMPLEX_LEVEL;
        else return increasedQualityLevel
    }
    return increasedQualityLevel;
};

BuildingSchema.methods.startCraftByBlueprint = async function(character, blueprintEntity, participants = [], resourcesMultiplier = 1) {
    if (participants.length < 1) {
        throw new Error("At least one participant must be present in craft process");
    }
    // Get rid of duplicates
    participants = [...new Set(participants)];

    // Check whether resources multiplier is valid
    let resourcesQualityLevel;
    switch (resourcesMultiplier) {
        case 0.5: resourcesQualityLevel = POOR_LEVEL;    break;
        case 1:   resourcesQualityLevel = BASIC_LEVEL;   break;
        case 1.5: resourcesQualityLevel = SOLID_LEVEL;   break;
        case 3:   resourcesQualityLevel = COMPLEX_LEVEL; break;
        default: throw new Error("Incorrect resources multiplier");
    }

    const blueprint = await blueprintEntity.blueprint;

    // Check whether all defined participants are free
    if (this.fraction_id !== null) {
        // All participants must be fraction members + must be free (don't participate in other crafts)
        const fraction    = await this.fraction;
        const freeMembers = await fraction.free_members;
        participants.map((participantId) => {
            const isFree = freeMembers.filter(freeMember => {
                return freeMember._id.equals(participantId)
            }).length !== 0;
            if (!isFree) {
                throw new Error("One of defined participants is busy")
            }
        })
    } else {
        if (participants[0] !== this.character_id || participants.length > 1) {
            throw new Error("Only owner of the building can participate in craft")
        }
    }

    // Check whether defined participants have suitable perks
    let perksQualityLevel = COMPLEX_LEVEL;
    if (blueprint.required_perks.length === 0) {
        let availablePerks = [];
        const characters = await model("Character").find({"_id": { $in: participants }});
        characters.some((character) => {
            if (availablePerks.length === blueprint.required_perks.length) return true;
            character.perks.some((perk) => {
                if (!hasObjectId(availablePerks, perk) && hasObjectId(blueprint.required_perks, perk)) {
                    availablePerks.push(perk);
                    if (availablePerks.length === blueprint.required_perks.length) return true;
                }
            })
        });

        const percentageOfAvailable = availablePerks.length / blueprint.required_perks.length;
        if (percentageOfAvailable >= 0.75)      perksQualityLevel = COMPLEX_LEVEL;
        else if (percentageOfAvailable >= 0.50) perksQualityLevel = SOLID_LEVEL;
        else if (percentageOfAvailable >= 0.25) perksQualityLevel = BASIC_LEVEL;
        else perksQualityLevel = POOR_LEVEL;
    }

    // Define blueprint quality
    let blueprintQualityLevel;
    if (blueprintEntity.quality <= 7)       blueprintQualityLevel = POOR_LEVEL;
    else if (blueprintEntity.quality <= 14) blueprintQualityLevel = BASIC_LEVEL;
    else if (blueprintEntity.quality <= 19) blueprintQualityLevel = SOLID_LEVEL;
    else blueprintQualityLevel = COMPLEX_LEVEL;

    // Check whether building has ane of required facilities
    let facilitiesQualityLevel = BASIC_LEVEL;
    const facilitiesToUse = [];
    const freeFacilities = this.freeFacilities(null, "tech_tier", "DESC");
    if (blueprint.required_facilities.length > 0) {
        const hasFacility = blueprint.required_facilities.some((requiredFacility) => {
            const hasFacility = freeFacilities.some((freeFacility) => {
                if (!freeFacility.properties) throw new Error("building.facilities.properties must be populated");
                if (
                    requiredFacility.type_id.equals(freeFacility.properties.type_id) &&
                    requiredFacility.tech_tier <= freeFacility.properties.tech_tier
                ) {
                    facilitiesToUse.push(freeFacility._id.toString());
                    facilitiesQualityLevel = increaseQualityLevel(
                        freeFacility.properties.quality_level,
                        freeFacility.properties.tech_tier - requiredFacility.tech_tier
                    );
                    return true;
                }
            });
            if (hasFacility) return true;
        });

        if (!hasFacility) {
            throw new Error("Building doesn't have free facility of required type");
        }
    }

    // Check whether building has enough of resources
    const requiredResources = blueprint.required_resources.map((requiredResource) => {
        return { _id: requiredResource._id, amount: requiredResource.amount * resourcesMultiplier }
    });

    // Define how long the craft process will take
    const craftingTime = 60 * (blueprint.difficulty * (resourcesQualityLevel + facilitiesQualityLevel + perksQualityLevel + blueprintQualityLevel));

    // Define quality level
    const qualityLevel = resourcesQualityLevel + facilitiesQualityLevel + perksQualityLevel + blueprintQualityLevel;
    if (qualityLevel < BASIC_LEVEL) {
        throw new Error("Quality level is too low");
    }

    // Create craft process and take resources
    const craftProcessId = Types.ObjectId();
    this.craft_processes.push({
        _id:                  craftProcessId,
        crafting_id:          blueprint._id,
        blueprint_entity_id:  blueprintEntity._id,
        crafting_by:          "Blueprint",
        quality_level:        qualityLevel,
        // Clone current state of required resources to prevent saving unexpected changes
        used_resources:       JSON.parse(JSON.stringify(requiredResources)),
        resources_multiplier: resourcesMultiplier,
        creator_character_id: character ? character._id : null,
        crafting_fraction_id: this.fraction_id,
        crafting_characters:  participants,
        crafting_facilities:  facilitiesToUse,
        can_be_finished_after: moment().add(craftingTime, "minutes").toDate()
    });
    await this.editResources(invertResources(requiredResources.slice()));

    return craftProcessId;
};

BuildingSchema.methods.startCraftByRecipe = async function(character, recipe, quantity = 1) {
    if (quantity < 1) {
        throw new Error("Incorrect quantity");
    }

    // Check whether building has all required facilities
    let techTierBonus = 0;
    const facilitiesToUse = [];
    if (!recipe.required_facility_type_id) {
        const freeFacilities = this.freeFacilities(null, "tech_tier", "DESC");
        const hasFacility = freeFacilities.some((freeFacility) => {
            if (
                recipe.required_facility_type_id.equals(freeFacility.properties.type_id) &&
                recipe.tech_tier <= freeFacility.properties.tech_tier
            ) {
                facilitiesToUse.push(freeFacility._id);
                techTierBonus = freeFacility.properties.tech_tier - recipe.tech_tier;
                return true;
            }
        });
        if (!hasFacility) {
            throw new Error("Building doesn't have free facility of required type");
        }
    }

    const requiredResources = recipe.required_resources.map((requiredResource) => {
        return { _id: requiredResource._id, amount: requiredResource.amount * quantity }
    });

    // Define how long the craft process will take
    let craftingTime = recipe.craft_time * quantity;

    // Decrease crafting time if craft process is using facility with tech tier higher than required
    if (techTierBonus === 1) craftingTime *= 0.80;
    else if (techTierBonus > 1) craftingTime *= 0.50;

    // Create craft process and take resources
    const craftProcessId = Types.ObjectId();
    this.building.craft_processes.push({
        _id:                  craftProcessId,
        crafting_id:          recipe._id,
        crafting_by:          "recipe",
        quantity:             quantity,
        // Clone required resources to prevent saving unexpected changes
        used_resources:       JSON.parse(JSON.stringify(requiredResources)),
        creator_character_id: character ? character._id : null,
        crafting_fraction_id: this.fraction_id,
        crafting_facilities:  facilitiesToUse,
        can_be_finished_after:            moment().add(craftingTime, "minutes").toDate()
    });
    await this.editResources(invertResources(requiredResources.slice()));

    return craftProcessId;
};

BuildingSchema.methods.cancelCraft = async function(craftProcessId) {
    const craftProcess = this.craft_processes.id(craftProcessId);
    if (!craftProcess) {
        throw new Error("Unknown craft process")
    }

    if (craftProcess.can_be_finished_after <= Date.now()) {
        throw new Error("Craft process cannot be cancelled when craft time has passed")
    }

    if (craftProcess.is_finished) {
        throw new Error("Craft process is finished / cancelled / failed")
    }

    // Return resources to the building
    await this.editResources(craftProcess.used_resources);

    // Update craft process status
    craftProcess.is_finished  = true;
    craftProcess.is_cancelled = true;
    craftProcess.finished_at = Date.now();

    await this.save();
    return true;
};

BuildingSchema.methods.finishCraft = async function(craftProcessId) {
    const craftProcess = this.craft_processes.id(craftProcessId);
    if (!craftProcess) {
        throw new Error("Unknown craft process")
    }

    if (craftProcess.is_finished) {
        throw new Error("Craft process is finished / cancelled / failed")
    }

    switch (craftProcess.crafting_by) {
        case "Recipe": {
            // Add crafted resources to the building
            const recipe = await model("Recipe").findById(craftProcess.crafting_id);
            await this.editResources([{
                _id: recipe.resource_id,
                amount: craftProcess.quantity * recipe.amount
            }]);
            break;
        }
        case "Blueprint": {
            // Increase quality level of blueprint entity
            const blueprintEntity = await model("BlueprintEntity").findById(craftProcess.blueprint_entity_id);
            blueprintEntity.quality += 1;
            await blueprintEntity.save();

            // todo: Request MC server to give crafted item
            break;
        }
        default: throw new Error("Trying to process unknown type of craft process")
    }

    // Update craft process status
    craftProcess.is_finished = true;
    craftProcess.finished_at = Date.now();

    await this.save();
    return true;
};

BuildingSchema.methods.reworkCraft = async function(craftProcessId) {
    const craftProcess = this.craft_processes.id(craftProcessId);
    if (!craftProcess) {
        throw new Error("Unknown craft process")
    }

    if (craftProcess.can_be_finished_after > Date.now()) {
        throw new Error("Crafted item cannot be reworked until craft time has passed")
    }

    if (craftProcess.is_finished) {
        throw new Error("Craft process is finished / cancelled / failed")
    }

    // Quality level must be a real number (i.e 1.5 or 3.7, but not 4.0)
    if (!Number.isInteger(craftProcess.quality_level)) {
        throw new Error("Quality level isn't a real number")
    }

    // Condition: if d100 roll > fractional part of quality level
    // todo: make dice helper
    if ((Math.floor(Math.random() * 100) + 1) > (craftProcess.quality_level % 1 * 100)) {
        // Rework failed
        craftProcess.is_failed   = true;
        craftProcess.is_finished = true;
        craftProcess.finished_at = Date.now();
    } else {
        // Rework succeeded
        craftProcess.is_reworked   = true;
        craftProcess.quality_level = Math.ceil(craftProcess.quality_level);
    }

    await this.save();
    return Number(craftProcess.is_failed)
};

BuildingSchema.methods.continueCraft = async function(craftProcessId, autosave = true) {
    const craftProcess = this.craft_processes.id(craftProcessId);
    if (!craftProcess) {
        throw new Error("Unknown craft process")
    }

    if (!craftProcess.is_stopped || craftProcess.is_finished) {
        return false;
    }

    // Calculate new time when craft process will be finished
    const currentFinishAt = moment(craftProcess.can_be_finished_after);
    const stoppedAt       = moment(craftProcess.stopped_at);
    const timeDifference  = Math.abs(moment.duration(currentFinishAt.diff(stoppedAt)).asSeconds());

    craftProcess.is_stopped = false;
    craftProcess.stopped_at = null;
    craftProcess.can_be_finished_after  = moment().add(timeDifference, "seconds").toDate();

    if (autosave) {
        await this.save();
    }
    return true;
};

BuildingSchema.methods.stopCraft = async function(craftProcessId, autosave = true) {
    const craftProcess = this.craft_processes.id(craftProcessId);
    if (!craftProcess) {
        throw new Error("Unknown craft process")
    }

    if (craftProcess.is_stopped || craftProcess.can_be_finished_after < Date.now() || craftProcess.is_finished) {
        return false;
    }

    craftProcess.is_stopped = true;
    craftProcess.stopped_at = Date.now();

    if (autosave) {
        await this.save();
    }
    return true;
};

BuildingSchema.methods.continueAllCrafts = async function() {
    await Promise.all(this.unfinished_craft_processes.map((craftProcess) => {
        if (craftProcess.is_stopped) {
            return this.continueCraft(craftProcess._id, false);
        }
    }));
    await this.save();
    return true;
};

BuildingSchema.methods.stopAllCrafts = async function() {
    await Promise.all(this.unfinished_craft_processes.map((craftProcess) => {
        if (!craftProcess.is_stopped) {
            return this.stopCraft(craftProcess._id, false);
        }
    }));
    await this.save();
    return true;
};

BuildingSchema.methods.characterHasAccess = function(character, throwException = true) {
    if (
        (this.character_id && this.character_id.equals(character.id)) ||
        (character.fraction_id && this.fraction_id && this.fraction_id.equals(character.fraction_id))
    ) {
        return true;
    }
    if (throwException) throw new ErrorResponse("Character doesn't have access to building");
    return false;
};

BuildingSchema.methods.getCraftProcesses = function (getFinished) {
    // todo: probably craft processes should be separated between two arrays with finished/failed/cancelled and unfinished ones
    return this.craft_processes.map((craftProcess) => {
        if (craftProcess.is_finished === getFinished) {
            return craftProcess;
        }
    })
};

//endregion

const BuildingModel = model("Building", BuildingSchema);

module.exports = BuildingModel;