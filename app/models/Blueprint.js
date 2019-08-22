// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Schemas
const ResourceSchema = require("./schemas/Resource");
// Validators
const { exists } = require("../validators/General");

const RequiredFacilitiesSchema = new Schema({
    tech_tier: {
        type: Int32,
        required: true
    },
    facility_type_id: {
        type: Schema.Types.ObjectId,
        validate: exists("FacilityType")
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
        type: [Schema.Types.ObjectId],
        validate: exists("Perk"),
        required: true,
        default: []
    }
}));

module.exports = BlueprintModel;