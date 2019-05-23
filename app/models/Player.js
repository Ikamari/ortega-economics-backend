// Database
const { Schema, model } = require("mongoose");
// Validators
const { exists } = require("../validators/General");

// todo: rename to "Character"
const PlayerModel = model("Player", new Schema({
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

module.exports = PlayerModel;