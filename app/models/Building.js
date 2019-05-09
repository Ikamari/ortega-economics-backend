// Database
const { Schema, model } = require("mongoose");
// Models
const FractionModel = require("./Fraction");
const ResourceModel = require("./Resource");
// Schemas
const ResourceSchema = require("../schemas/Resource");
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
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
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
        type: Number,
        required: true,
        default: 0
    },
    used_workplaces: {
        type: Number,
        required: true,
        default: 0
    },
    storage_size: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    used_storage: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    resources: {
        type: Map,
        of: Number,
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
        type: Number,
        required: true,
        default: 0
    }
});

BuildingSchema.methods.editResources = function (resources, strictCheck = true) {
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
    return this.save();
};

BuildingSchema.methods.editResource = function (resource, strictCheck = true) {
    return this.editResources(resource, strictCheck)
};

const BuildingModel = model("Building", BuildingSchema);

module.exports = BuildingModel;