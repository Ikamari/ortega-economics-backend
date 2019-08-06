// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Models
const { TYPE_IDS: facilityTypeIds } = require("./Facility");
// Schemas
const ResourceSchema = require("./schemas/Resource");
// Validators
const { exists, includes } = require("../validators/General");

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
        validate: exists("Resource"),
        type: String,
        default: null
    },
    required_resources: {
        type: [ResourceSchema],
        required: true,
        default: []
    },
    required_facility_type_id: {
        validate: includes(Object.keys(facilityTypeIds)),
        type: Int32
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