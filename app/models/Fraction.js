// Database
const { Schema, model } = require("mongoose");
const Int32             = require("mongoose-int32");
// Validators
const { exists } = require("../validators/General");

const SquadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Int32,
        default: 0,
        required: true
    },
    experience_level: {
        type: Int32,
        default: 0,
        required: true
    },
    gear_level: {
        type: Int32,
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
        validate: exists(model("Trait")),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    }
});

// Get resources from all fraction's buildings
FractionSchema.virtual("resources").get(async function() {
    const buildings = await model("Building").find({ fraction_id: this._id });

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

// Get overall info about free/available storage space in buildings of fraction
FractionSchema.virtual("storage").get(async function() {
    const buildings = await model("Building").find({ fraction_id: this._id });

    let storage = {
        storage_size: 0,
        used_storage: 0
    };
    buildings.map((building) => {
        storage.storage_size += building.storage_size;
        storage.used_storage += building.used_storage;
    });

    return storage;
});

// Get all fraction members
FractionSchema.virtual("members").get(async function() {
    return await model("Player").find({ fraction_id: this._id });
});

// Get all fraction buildings
FractionSchema.virtual("buildings").get(async function() {
    return await model("Building").find({ fraction_id: this._id });
});

const FractionModel = model("Fraction", FractionSchema);

module.exports = FractionModel;