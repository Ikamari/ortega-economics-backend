// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Schemas
const ResourceSchema = require("./schemas/Resource");
// Validators
const { exists } = require("../validators/General");

const RecipeSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: "Unnamed"
    },
    item_id: {
        type: String,
        default: null
    },
    resource_id: {
        type: Schema.Types.ObjectId,
        validate: exists("Resource"),
        default: null
    },
    required_resources: {
        type: [ResourceSchema],
        required: true,
        default: []
    },
    required_facility_type_id: {
        type: Schema.Types.ObjectId,
        validate: exists("FacilityType")
    },
    tech_tier: {
        type: Int32,
        required: true
    },
    amount: {
        type: Int32,
        required: true,
        default: 1
    },
    // In minutes
    craft_time: {
        type: Number,
        required: true,
        default: 0
    }
});

RecipeSchema.virtual("facility_type_properties", {
    ref:          "FacilityType",
    localField:   "required_facility_type_id",
    foreignField: "_id",
    justOne:      true
});

RecipeSchema.set("toJSON", { transform: function(doc, ret, options) {
    if (options.includeFacilityName && doc.properties) {
        ret.facility_type_name = doc.properties.facility_type_name;
    }
    return ret;
}});

const RecipeModel = model("Recipe", RecipeSchema);

module.exports = RecipeModel;