// Database
const { Schema, model } = require("mongoose");
// Models
const Trait = require("./Trait");
// Schemas
const Resource = require("../schemas/Resource");
// Validators
const { exists } = require("../validators/General");

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

const FractionModel = model("Fraction", new Schema({
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
        validate: exists(Trait),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    // resources: {
    //     // todo: show contents of all buildings
    //     type: [Resource],
    //     required: true,
    //     default: []
    // }
}));

module.exports = FractionModel;