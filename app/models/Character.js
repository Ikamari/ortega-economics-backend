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
        validate: exists("Fraction"),
        type: Schema.Types.ObjectId,
        default: null
    },
    perks: {
        validate: exists("Perk"),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    }
}));

module.exports = CharacterModel;