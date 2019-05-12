// Database
const { Schema, model } = require("mongoose");
const Int32             = require("mongoose-int32");
// Schemas
const ResourceSchema = require("../schemas/Resource");
// Validators
const { exists } = require("../validators/General");

const BlueprintModel = model("Blueprint", new Schema({
    name: {
        type: String,
        required: true,
        default: "Unnamed"
    },
    quality: {
        type: Int32,
        required: true,
        default: 0
    },
    craft_time: {
        type: Number,
        required: true,
        default: 0
    },
    required_resources: {
        type: [ResourceSchema],
        required: true,
        default: []
    },
    required_facilities: {
        validate: exists(model("Facility")),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    required_perks: {
        validate: exists(model("Perk")),
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