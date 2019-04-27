// Database
const { Schema, model } = require("mongoose");
// Models
const Fraction = require("./Fraction");
const Perk = require("./Perk");
// Validators
const { exists } = require("../validators/General");

const PlayerModel = model("Player", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fraction_id: {
        validate: exists(Fraction),
        type: Schema.Types.ObjectId,
        default: null
    },
    perks: {
        validate: exists(Perk),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    }
    // todo: add recipes
}));

module.exports = PlayerModel;