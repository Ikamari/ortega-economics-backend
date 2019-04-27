// Database
const { Schema, model } = require("mongoose");
// Models
const Fraction = require("./Fraction");
const ResourceModel = require("./Resource");
// Schemas
const ResourceSchema = require("../schemas/Resource");
// Validators
const { exists } = require("../validators/General");

const resourceTurnoverSchema = new Schema({
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
        validate: exists(Fraction),
        type: Schema.Types.ObjectId,
        default: null
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
        default: 0
    },
    resources: {
        type: [ResourceSchema],
        required: true,
        default: []
    },
    produced_resources: {
        type: [resourceTurnoverSchema],
        required: true,
        default: []
    },
    consumed_resources: {
        type: [resourceTurnoverSchema],
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