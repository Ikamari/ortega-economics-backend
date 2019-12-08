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
    type_id: {
        type: Schema.Types.ObjectId,
        validate: exists("FacilityType")
    }
});

const BlueprintSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: "Unnamed"
    },
    item_id: {
        type: String,
        // todo: uncomment when item ids will be available
        // required: true
    },
    difficulty: {
        type: Number,
        required: true,
        default: 1,
        min: 1
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
});

BlueprintSchema.virtual("entities").get(function () {
    return model("BlueprintEntity").find({ blueprint_id: this._id });
});

RequiredFacilitiesSchema.virtual("properties", {
    ref:          "FacilityType",
    localField:   "type_id",
    foreignField: "_id",
    justOne:      true
});

RequiredFacilitiesSchema.set("toJSON", { transform: function(doc, ret, options) {
    if (options.includeFacilityName && doc.properties) {
        ret.name = doc.properties.name;
    }
    return ret;
}});

const BlueprintModel = model("Blueprint", BlueprintSchema);

module.exports = BlueprintModel;