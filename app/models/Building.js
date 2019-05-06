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

const BuildingModel = model("Building", new Schema({
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
    // Todo: Check size when trying to add something
    storage_size: {
        type: Number,
        required: true,
        default: 0
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
}));

module.exports = BuildingModel;