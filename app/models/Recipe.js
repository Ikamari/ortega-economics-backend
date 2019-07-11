// Database
const { Schema, model } = require("mongoose");
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
        validate: exists("Resource"),
        type: String,
        default: null
    },
    required_resources: {
        type: [ResourceSchema],
        required: true,
        default: []
    },
    required_facilities: {
        validate: exists("FacilityType"),
        type: Schema.Types.ObjectId,
        required: true,
        default: []
    },
    craft_time: {
        type: Number,
        required: true,
        default: 0
    }
}));

module.exports = RecipeModel;