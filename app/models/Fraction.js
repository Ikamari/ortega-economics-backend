// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Helpers
const { mergeResources, sortResources } = require("../helpers/ResourcesHelper");
const { sortByStoragePriority } = require("../helpers/BuildingsHelper");
// Validators
const { exists } = require("../validators/General");

const SquadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Int32,
        default: 0,
        required: true
    },
    experience_level: {
        type: Int32,
        default: 0,
        required: true
    },
    gear_level: {
        type: Int32,
        default: 0,
        required: true
    },
    description: {
        type: String,
        default: "",
        required: true
    }
});

const FractionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    squads: {
        type: [SquadSchema],
        required: true,
        default: []
    },
    traits: {
        type: [Schema.Types.ObjectId],
        validate: exists("Trait"),
        required: true,
        default: []
    }
});

FractionSchema.methods.hasResources = async function(resourcesToFind, throwException = true) {
    const fractionResources = await this.resources;
    try {
        resourcesToFind.map((resourceToFind) => {
            if (Math.abs(resourceToFind.amount) > fractionResources[resourceToFind._id]) {
                throw new Error("Fraction doesn't have enough of resources");
            }
        })
    } catch (e) {
        if (throwException) throw e;
        return false
    }
    return true
}

FractionSchema.methods.hasEnergy = async function(amountOfEnergy, throwException = true) {
    const result = (await this.energy).free >= amountOfEnergy;
    if (throwException && !result) {
        throw new Error("Fraction doesn't have enough of energy")
    }
    return result;
}

FractionSchema.methods.editResources = async function(resources, strictCheck = true) {
    // todo: Try to use transactions (replica sets are required)
    const storageInfo = await this.storage;
    let resourcesToAdd = sortResources(mergeResources(resources));
    let neededStorageSize = 0;

    // Count overall amount of resources
    resources.map((resource) => {
        neededStorageSize += resource.amount;
    });

    // Storage mustn't be overflowed
    if (neededStorageSize + storageInfo.used_storage > storageInfo.storage_size) {
        throw new Error(`Storage will be overflowed (new: ${neededStorageSize + storageInfo.used_storage} > max: ${storageInfo.storage_size})`);
    }

    const buildings = sortByStoragePriority(await this.buildings);
    resourcesToAdd.forEach((resource, key, resources) => {
        for (const building of buildings) {
            if (resources[key].amount === 0) {
                break;
            }
            const resourceId = resource._id.toString();

            // Add and subtract operations must be processed differently
            if (resource.amount >= 0) {
                // Check whether there's enough of space in building
                if (building.used_storage === building.storage_size) continue;

                // Add possible amount of resource to storage and used storage size
                const availableStorage = building.storage_size - building.used_storage;
                let amountToAdd;

                if (availableStorage >= resource.amount) {
                    amountToAdd = resource.amount;
                    resources[key].amount = 0;
                } else {
                    amountToAdd = availableStorage;
                    resources[key].amount -= availableStorage;
                }

                building.used_storage += amountToAdd;
                if (building.resources.has(resourceId)) {
                    building.resources.set(resourceId, building.resources.get(resourceId) + amountToAdd);
                } else {
                    building.resources.set(resourceId, amountToAdd);
                }
            } else {
                // Check whether building has such resource
                if (!building.resources.has(resourceId)) {
                    continue;
                }

                // Subtract possible amount of resource from storage and used storage size
                const difference = building.resources.get(resourceId) + resource.amount;

                let amountToRemove;
                if (difference < 0) {
                    amountToRemove = Math.abs(resource.amount - difference);
                    resources[key].amount += amountToRemove;
                } else {
                    amountToRemove = Math.abs(resource.amount);
                    resources[key].amount = 0;
                }

                building.used_storage -= amountToRemove;
                building.resources.set(resourceId, building.resources.get(resourceId) - amountToRemove);
            }
        }
    })

    // Check whether all resources was successfully added or subtracted
    if (strictCheck) {
        resourcesToAdd.map((resource) => {
            if (resource.amount !== 0) {
                throw new Error("Not enough of storage space or resources to remove");
            }
        })
    }

    // Used storage size cannot be negative
    if (neededStorageSize + storageInfo.used_storage < 0) {
        throw new Error("Used storage size cannot be negative");
    }

    // Commit changes
    // todo: log changes
    buildings.map(async (building) => {
        await building.save();
    })
};

FractionSchema.methods.editResource = async function(resource, strictCheck = true) {
    this.editResources([resource], strictCheck);
}

// Disable all facilities of fraction
FractionSchema.methods.blackout = async function() {
    (await this.buildings).map(async (building) => {
        await building.disable(true);
    });
}

FractionSchema.virtual("free_members").get(async function() {
    const
        busyMembers = {},
        buildings   = await this.buildings,
        members     = await this.members;

    // Get ObjectID of all busy members (that currently participate in craft)
    buildings.map((building) => {
        building.craft_processes.map((craftProcess) => {
            if (craftProcess.is_finished) return;
            craftProcess.crafting_characters.map((craftingCharacterId) => {
                busyMembers[craftingCharacterId.toString()] = true;
            })
        })
    })

    // Get free members
    return members.map((member) => {
        if (!(member._id.toString() in busyMembers)) return member
    }).filter(member => member !== undefined)
})

// Get overall info about free/available energy in fraction
FractionSchema.virtual("energy").get(async function() {
    const buildings = await this.buildings.populate("facilities.properties").exec();
    const energyInfo = {
        consumption: 0,
        production: 0
    };

    buildings.map(async (building) => {
        if (building.is_active) {
            energyInfo.production += building.energy_production;
            energyInfo.consumption += await building.energy_consumption;
        }
    });

    energyInfo.free = energyInfo.production - energyInfo.consumption;
    return energyInfo;
})

// Get resources from all fraction's buildings
FractionSchema.virtual("resources").get(async function() {
    const buildings = await model("Building").find({ fraction_id: this._id });

    let resources = {};
    buildings.map((building) => {
        building.resources.forEach((value, key) => {
            if (key in resources) {
                resources[key] += value;
            } else {
                resources[key] = value;
            }
        })
    });

    return resources;
});

// Get overall info about free/available storage space in buildings of fraction
FractionSchema.virtual("storage").get(async function() {
    const buildings = await model("Building").find({ fraction_id: this._id });

    let storage = {
        storage_size: 0,
        used_storage: 0
    };
    buildings.map((building) => {
        storage.storage_size += building.storage_size;
        storage.used_storage += building.used_storage;
    });

    return storage;
});

// Get all fraction members
FractionSchema.virtual("members").get(function() {
    return model("Character").find({ fraction_id: this._id });
});

// Get all fraction buildings
FractionSchema.virtual("buildings").get(function() {
    return model("Building").find({ fraction_id: this._id });
});

const FractionModel = model("Fraction", FractionSchema);

module.exports = FractionModel;