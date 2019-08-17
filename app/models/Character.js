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
        type: Schema.Types.ObjectId,
        validate: exists("Fraction"),
        default: null
    },
    perks: {
        type: [Schema.Types.ObjectId],
        validate: exists("Perk"),
        required: true,
        default: []
    }
}));

module.exports = CharacterModel;