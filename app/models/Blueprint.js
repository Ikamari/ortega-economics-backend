// Database
const { Schema, model } = require("mongoose");
// Models
const Facility = require("./Facility");
const Perk = require("./Perk");
// Schemas
const Resource = require("../schemas/Resource");
// Validators
const { exists } = require("../validators/General");

const BlueprintModel = model("Blueprint", new Schema({
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
        validate: exists(Facility),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    required_perks: {
        validate: exists(Perk),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    is_public: {
        type: Boolean,
        required: true,
        default: false
    }
}));

module.exports = BlueprintModel;