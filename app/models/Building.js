// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
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
        max: 100,
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
    defense_level: {
        type: Int32,
        required: true,
        default: 0
    }
});

BuildingSchema.methods.editResources = function(resources, strictCheck = true) {
    // todo: merge repeating resources
    let newUsedStorage = 0;

    // Add or remove specified resources
    resources.map((resource) => {
        let newAmount = 0;
        if (this.resources.has(resource._id)) {
            newAmount = this.resources.get(resource._id) + resource.amount;
            this.resources.set(resource._id, newAmount)
        } else {
            newAmount = resource.amount;
            this.resources.set(resource._id, newAmount)
        }
        newUsedStorage += newAmount;
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
        throw Error("Can't find specified turnover")
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
        throw Error("Can't find specified turnover")
    }
    turnover.remove();
    return autoSave ? this.save() : true;
}

const BuildingModel = model("Building", BuildingSchema);

module.exports = BuildingModel;