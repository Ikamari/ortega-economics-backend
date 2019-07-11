// Database
const { Schema } = require("mongoose");
const Int32      = require("mongoose-int32");
// Schemas
const ResourceSchema = require("../schemas/Resource");
// Validators
const { exists, existsIn } = require("../../validators/General");

const CraftProcessSchema = new Schema({
    crafting_id: {
        validate: existsIn(["Recipe", "Blueprint"]),
        type: Schema.Types.ObjectId,
        required: true
    },
    crafting_by: {
        validate: {
            validator: (value) => (value === "Recipe" || value === "Blueprint"),
            message: props => `${props.path} must be "Recipe" or "Blueprint"`
        },
        type: String,
        required: true
    },
    quantity: {
        type: Int32,
        required: true,
        default: 1
    },
    used_resources: {
        type: [ResourceSchema],
        required: true,
        default: []
    },
    resources_multiplier: {
        type: Number,
        default: 1,
        required: true
    },
    creator_character_id: {
        validate: exists("Character"),
        type: Schema.Types.ObjectId,
        required: true
    },
    crafting_characters: {
        validate: exists("Character"),
        type: [Schema.Types.ObjectId],
        default: [],
        required: true
    },
    crafting_facilities: {
        // todo: check existence of nested document
        // validate: exists("Facility"),
        type: [Schema.Types.ObjectId],
        default: [],
        required: true
    },
    started_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    finish_at: {
        type: Date,
        required: true
    },
    is_finished: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = CraftProcessSchema;