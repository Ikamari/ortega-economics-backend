// Database
const { Schema, model } = require("mongoose");
// Schemas
const ResourceSchema = require("./schemas/Resource");
// Validators
const { exists, includes } = require("../validators/General");

const RequiredFacilitiesSchema = new Schema({
    quality_level: {
        type: String,
        validate: includes(["poor", "basic", "solid", "complex"]),
        required: true
    },
    facilities: {
        validate: exists("Facility"),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    }
})

const BlueprintModel = model("Blueprint", new Schema({
    name: {
        type: String,
        required: true,
        default: "Unnamed"
    },
    item_id: {
        type: String,
        required: true
    },
    time_multiplier: {
        type: Number,
        required: true,
        default: 1
    },
    required_resources: {
        type: [ResourceSchema],
        required: true,
        default: []
    },
    required_facilities: {
        type: [RequiredFacilitiesSchema],
        required: true,
        default: []
    },
    required_perks: {
        validate: exists("Perk"),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    }
}));

module.exports = BlueprintModel;