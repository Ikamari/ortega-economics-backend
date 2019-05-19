// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Helpers
const { mergeResources, sortResources } = require("../helpers/ResourcesHelper");
// Models
const FractionModel = require("./Fraction");
const ResourceModel = require("./Resource");
// Validators
const { exists } = require("../validators/General");

const ResourceTurnoverSchema = new Schema({
    resource_id: {
        validate: exists(ResourceModel),
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
        validate: exists(FractionModel),
        type: Schema.Types.ObjectId,
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
        required: true,
        default: {},
        validate: exists(ResourceModel)
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
    is_active: {
        type: Boolean,
        required: true,
        default: false
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

BuildingSchema.methods.editResources = function(resources, strictCheck = true) {
    resources = sortResources(mergeResources(resources));
    let newUsedStorage = 0;

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
        newUsedStorage += newAmount;

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
                throw new Error("Amount of specific resource cannot be negative");
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

BuildingSchema.methods.editResource = function(resource, strictCheck = true) {
    return this.editResources(resource, strictCheck)
};

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