// Database
const { Schema, model } = require("mongoose");
// Models
const TraitModel    = require("./Trait");
// Validators
const { exists } = require("../validators/General");

const SquadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0,
        required: true
    },
    experience_level: {
        type: Number,
        default: 0,
        required: true
    },
    gear_level: {
        type: Number,
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
        validate: exists(TraitModel),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    // todo: show all fraction members
});

// Get resources from all fraction's buildings
FractionSchema.virtual("resources").get(async function() {
    // TODO: Check whether it's ok that require("./Building") should be used
    const buildings = await require("./Building").find({ fraction_id: this._id });

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

// Get all fraction members
FractionSchema.virtual("members").get(async function() {
    // TODO: Check whether it's ok that require("./Player") should be used
    return await require("./Player").find({ fraction_id: this._id });
});

const FractionModel = model("Fraction", FractionSchema);

module.exports = FractionModel;