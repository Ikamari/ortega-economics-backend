// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Schemas
const ResourceSchema = require("./schemas/Resource");
// Validators
const { exists } = require("../validators/General");

const RecipeModel = model("Recipe", new Schema({
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
        type: String,
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
}));

module.exports = RecipeModel;