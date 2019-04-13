// Database
const { Schema, model } = require("mongoose");
// Schemas
const Resource = require("../schemas/Resource");

const squadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    experience_level: {
        type: Number,
        default: 0
    },
    gear_level: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ""
    }
});

module.exports = model("Fraction", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    squads: {
        type: [squadSchema],
        required: true,
        default: []
    },
    traits: {
        // todo: add id validation
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    resources: {
        type: [Resource],
        required: true,
        default: []
    }
}));