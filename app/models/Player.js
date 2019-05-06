// Database
const { Schema, model } = require("mongoose");
// Models
const FractionModel = require("./Fraction");
const PerkModel     = require("./Perk");
// Validators
const { exists } = require("../validators/General");

const PlayerModel = model("Player", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fraction_id: {
        validate: exists(FractionModel),
        type: Schema.Types.ObjectId,
        default: null
    },
    perks: {
        validate: exists(PerkModel),
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    }
    // todo: add recipes
}));

module.exports = PlayerModel;