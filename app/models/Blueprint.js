// Database
const { Schema, model } = require("mongoose");
// Schemas
const Resource = require("../schemas/Resource");

module.exports = model("Blueprint", new Schema({
    name: {
        type: String,
        required: true
    },
    quality: {
        type: Number,
        required: true
    },
    craft_time: {
        type: Number,
        required: true,
        default: 0
    },
    required_resources: {
        type: [Resource],
        required: true,
        default: []
    },
    required_facilities: {
        // todo: add id validation
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    required_perks: {
        // todo: add id validation
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    }
}));