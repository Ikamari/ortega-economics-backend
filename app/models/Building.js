// Database
const { Schema, model } = require("mongoose");
// Schemas
const Resource = require("../schemas/Resource");

const resourceTurnoverSchema = new Schema({
    resource_id: {
        // todo: add id validation
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

module.exports = model("Building", new Schema({
    fraction_id: {
        // todo: add id validation
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