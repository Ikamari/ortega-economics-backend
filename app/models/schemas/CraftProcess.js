// Database
const { Schema } = require("mongoose");
const Int32      = require("mongoose-int32");
// Schemas
const ResourceSchema = require("../schemas/Resource");
// Validators
const { exists, existsIn } = require("../../validators/General");

const STATUS_IDS = {
    1: "Crafting",           "Crafting": 1,
    2: "Finished",           "Finished": 2,
    3: "Finished (Forced)",  "Finished (Forced)": 3,
    4: "Cancelled",          "Cancelled": 4,
    5: "Cancelled (Forced)", "Cancelled (Forced)": 5
};

const CraftProcessSchema = new Schema({
    crafting_id: {
        type: Schema.Types.ObjectId,
        validate: existsIn(["Recipe", "Blueprint"]),
        required: true
    },
    blueprint_entity_id: {
        type: Schema.Types.ObjectId,
        validate: exists("BlueprintEntity"),
        default: null
    },
    crafting_by: {
        type: String,
        validate: {
            validator: (value) => (value === "Recipe" || value === "Blueprint"),
            message: props => `${props.path} must be "Recipe" or "Blueprint"`
        },
        required: true
    },
    quality_level: {
        type: Number,
        default: null
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
        type: Schema.Types.ObjectId,
        validate: exists("Character"),
        required: true
    },
    crafting_fraction_id: {
        type: Schema.Types.ObjectId,
        validate: exists("Fraction"),
        default: null
    },
    crafting_characters: {
        type: [Schema.Types.ObjectId],
        validate: exists("Character"),
        default: [],
        required: true
    },
    crafting_facilities: {
        type: [Schema.Types.ObjectId],
        // todo: check existence of nested document
        // validate: exists("Facility"),
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
    },
    status_id: {
        type: Int32,
        default: STATUS_IDS["Crafting"],
        required: true
    }
});

module.exports = CraftProcessSchema;
module.exports.STATUS_IDS = STATUS_IDS;