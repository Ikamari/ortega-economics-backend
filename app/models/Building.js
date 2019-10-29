// Database
const { Schema, Types, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Helpers
const { mergeResources, sortResources } = require("../helpers/ResourcesHelper");
const { hasObjectId } = require("../helpers/ObjectIdHelper");
// Validators
const { exists } = require("../validators/General");
// Schemas
const FacilityEntitySchema = require("./schemas/FacilityEntity")
const CraftProcessSchema = require("./schemas/CraftProcess")

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
    craft_processes: {
        type: [CraftProcessSchema],
        required: true,
        default: []
    },
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
    production_priority: {
        type: Int32,
        required: true,
        default: 0
    },
    storage_priority: {
        type: Int32,
        required: true,
        default: 0
    },
    defense_level: {
        type: Int32,
        required: true,
        default: 0
    }
});

BuildingSchema.virtual("fraction").get(async function () {
    return await model("Fraction").findById({ _id: this.fraction_id });
})

BuildingSchema.virtual("free_facilities").get(function() {
    return this.freeFacilities();
})

BuildingSchema.virtual("energy_consumption").get(async function () {
    if (!this.populated("facilities.properties")) {
        await this.populate("facilities.properties").execPopulate();
    }

    let energyConsumption = 0;
    this.facilities.map((facility) => {
        if (facility.is_active) {
            energyConsumption += facility.properties.energy_consumption;
        }
    })

    return energyConsumption;
})

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
})

BuildingSchema.methods.populateFacilities = function() {
    return new Promise((resolve) => {
        if (!this.populated("facilities.properties")) {
            this.populate("facilities.properties").execPopulate().then(() => resolve(true));
        } else {
            resolve(true)
        }
    })
}

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
}

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
}

BuildingSchema.methods.disable = function(isBlackout = false) {
    return new Promise((resolve, reject) => {
        if (this.is_active === false) resolve(true);

        if (this.fraction_id && !isBlackout) {
            this.energy.then((buildingEnergyInfo) => {
                this.fraction.then((fraction) =>
                    fraction.hasEnergy(buildingEnergyInfo.consumption - buildingEnergyInfo.production, true)
                        .then((result) => {
                            if (!result) {
                                resolve(true);
                                return
                            }
                            // todo: Pause all craft processes
                            this.is_active = false;
                            this.save().then(() => resolve(true));
                        })
                )
            });
            return;
        }

        // todo: Pause all craft processes
        this.is_active = false;
        this.save().then(() => resolve(true))
    })
}

BuildingSchema.methods.freeFacilities = function(filter, sortBy, sortDirection = "ASC") {
    if (this.populate() === undefined && (sortBy || filter)) {
        throw new Error("facilities.properties must be populated in order to use this method with sort or filter")
    }

    let freeFacilities = [];
    this.facilities.map((facility) => {
        if (!facility.is_active) return;
        let isFree = true;
        // Facility shouldn't be present in any active craft process
        this.craft_processes.some((craftProcess) => {
            if (!craftProcess.is_finished && hasObjectId(craftProcess.crafting_facilities, facility._id)) {
                return isFree = false;
            }
        });
        if (isFree && filter instanceof Function) {
            isFree = filter(facility);
        }
        if (isFree) {
            freeFacilities.push(facility);
        }
    });

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
}

BuildingSchema.methods.hasResources = function(resourcesToFind, throwException = true) {
    try {
        resourcesToFind.map((resourceToFind) => {
            if (Math.abs(resourceToFind.amount) > this.resources.get(resourceToFind._id.toString())) {
                throw new Error("Building doesn't have enough of resources");
            }
        })
    } catch (e) {
        if (throwException) throw e;
        return false
    }
    return true
}

// todo: add and use autosave parameter
BuildingSchema.methods.editResources = function(resources, strictCheck = true) {
    resources = sortResources(mergeResources(resources));
    let newUsedStorage = this.used_storage;

    // Add or remove specified resources
    resources.map((resource) => {
        // Skip iteration if storage is fully filled
        if (resource.amount >= 0 && newUsedStorage >= this.storage_size) return;
        const resourceId = resource._id.toString();

        let newAmount = 0;
        if (this.resources.has(resourceId)) {
            newAmount = this.resources.get(resourceId) + resource.amount;
            this.resources.set(resourceId, newAmount)
        } else {
            newAmount = resource.amount;
            this.resources.set(resourceId, newAmount)
        }
        newUsedStorage += resource.amount;

        // If storage got overflowed and strict check is disabled, subtract part of resources to fit storage size
        if (newUsedStorage > this.storage_size && !strictCheck) {
            const amountToSubtract = newUsedStorage - this.storage_size;
            this.resources.set(resourceId, this.resources.get(resourceId) - amountToSubtract);
            newUsedStorage -= amountToSubtract
        }
    });

    // Storage mustn't be overflowed
    if (newUsedStorage > this.storage_size) {
        throw new Error(`Storage will be overflowed (new: ${newUsedStorage} > max: ${this.storage_size})`);
    }

    // Amount of resources must be >= 0
    this.resources.forEach((amount, resourceId) => {
        if (amount < 0) {
            if (strictCheck) {
                throw new Error("Storage doesn't have enough of specific resource");
            } else {
                newUsedStorage += Math.abs(this.resources.get(resourceId));
                this.resources.set(resourceId, 0)
            }
        }
    });

    // Used storage size cannot be negative
    if (newUsedStorage < 0) {
        throw new Error("Used storage size cannot be negative");
    }

    this.used_storage = newUsedStorage;
    // todo: log changes
    return this.save();
};

// todo: add and use autosave parameter
BuildingSchema.methods.editResource = function(resource, strictCheck = true) {
    return this.editResources(resource, strictCheck)
};

BuildingSchema.methods.addFacility = function(facilityId, isActive = true) {
    return new Promise((resolve, reject) => {
        model("Facility").findById(facilityId).then((facility) => {
            if (!facility) reject("Unable to find specified facility entity");

            const newFacilityEntity = {
                _id: Types.ObjectId(),
                facility_id: facilityId,
                is_active: false
            };

            if (isActive) {
                // Check whether fraction/building has enough of energy
                this.hasEnergy(facility.energy_consumption, false, false).then((hasEnergy) => {
                    newFacilityEntity.is_active = hasEnergy;
                    this.facilities.push(newFacilityEntity);
                    this.save().then(() => resolve(newFacilityEntity._id));
                });
            } else {
                this.facilities.push(newFacilityEntity);
                this.save().then(() => resolve(newFacilityEntity._id));
            }
        })
    })
}

BuildingSchema.methods.enableFacility = async function(facilityEntityId) {
    return new Promise((resolve, reject) => {
        const facilityEntity = this.facilities.id(facilityEntityId);
        if (!facilityEntity) reject("Unable to find specified facility entity");
        if (facilityEntity.is_active === true) resolve(true);

        this.populateFacilities().then(() => {
            this.hasEnergy(facilityEntity.properties.energy_consumption).then(() => {
                facilityEntity.is_active = true;
                this.save().then(() => resolve(true));
            })
        })
    });
}

BuildingSchema.methods.disableFacility = function(facilityEntityId) {
    return new Promise((resolve, reject) => {
        const facilityEntity = this.facilities.id(facilityEntityId);
        if (!facilityEntity) reject("Unable to find specified facility entity");
        if (facilityEntity.is_active === false) resolve(true);

        const isFree = this.freeFacilities.some((freeFacility) => {
            return freeFacility._id.equals(facilityEntityId)
        })
        if (!isFree) {
            reject("Facility cannot be disabled. It's currently used in craft process")
        } else {
            facilityEntity.is_active = false;
            this.save().then(() => resolve(true));
        }
    });
}

BuildingSchema.methods.removeFacility = function(facilityEntityId) {
    return new Promise((resolve, reject) => {
        const facilityEntity = this.facilities.id(facilityEntityId);
        if (!facilityEntity) reject("Unable to find specified facility entity");

        const isFree = this.freeFacilities.some((freeFacility) => {
            return freeFacility._id.equals(facilityEntityId)
        })
        if (!isFree) {
            reject("Facility cannot be removed. It's currently used in craft process")
        } else {
            facilityEntity.remove();
            this.save().then(() => resolve(true));
        }
    });
}

BuildingSchema.methods.addProduction = function (turnover, autoSave = true) {
    this.produces.push({
        resource_id: turnover._id,
        amount:      turnover.amount,
        chance:      turnover.chance
    })
    return autoSave ? this.save() : true;
}

BuildingSchema.methods.removeProduction = function (turnoverId, autoSave = true) {
    const turnover = this.produces.id(turnoverId);
    if (!turnover) {
        throw new Error("Can't find specified turnover")
    }
    turnover.remove();
    return autoSave ? this.save() : true;
}

BuildingSchema.methods.addConsumption = function (turnover, autoSave = true) {
    this.consumes.push({
        resource_id: turnover._id,
        amount:      turnover.amount,
        chance:      turnover.chance
    })
    return autoSave ? this.save() : true;
}

BuildingSchema.methods.removeConsumption = function (turnoverId, autoSave = true) {
    const turnover = this.produces.id(turnoverId);
    if (!turnover) {
        throw new Error("Can't find specified turnover")
    }
    turnover.remove();
    return autoSave ? this.save() : true;
}

const BuildingModel = model("Building", BuildingSchema);

module.exports = BuildingModel;