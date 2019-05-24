// Database
const { Schema, model } = require("mongoose");
// Validators
const { exists, existsIn } = require("../validators/General");

const CraftProcessModel = model("CraftProcess", new Schema({
    crafting_id: {
        validate: existsIn([model("Recipe"), model("Blueprint")]),
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
    crafting_character_id: {
        validate: exists(model("Character")),
        type: Schema.Types.ObjectId,
        default: null
    },
    // todo: uncomment when User model will be ready
    // crafting_user_id: {
    //     validate: exists(model("User")),
    //     type: Schema.Types.ObjectId,
    //     default: null
    // },
    crafting_fraction_id: {
        validate: exists(model("Fraction")),
        type: Schema.Types.ObjectId,
        default: null
    },
    started_at: {
        type: Date,
        required: true
    },
    finish_at: {
        type: Date,
        required: true
    }
}));

module.exports = CraftProcessModel;