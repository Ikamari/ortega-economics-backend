// Database
const { Schema, model } = require("mongoose");
// Validators
const { exists } = require("../validators/General");

const CharacterModel = model("Character", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fraction_id: {
        validate: exists(model("Fraction")),
        type: Schema.Types.ObjectId,
        default: null
    },
    perks: {
        validate: exists(model("Perk")),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    }
    // todo: add recipes
}));

module.exports = CharacterModel;