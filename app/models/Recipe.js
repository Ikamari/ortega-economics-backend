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
    resource_id: {
        validate: exists(model("Resource")),
        type: String,
        required: true,
        default: "1"
    },
    required_resources: {
        type: [ResourceSchema],
        required: true,
        default: []
    },
    required_facility: {
        validate: exists(model("Facility")),
        type: Schema.Types.ObjectId,
        required: true,
        default: []
    },
    is_public: {
        type: Boolean,
        required: true,
        default: false
    }
}));

module.exports = RecipeModel;