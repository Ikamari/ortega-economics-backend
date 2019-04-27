// Database
const { Schema, model } = require("mongoose");

const PerkModel = model("Perk", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}));

module.exports = PerkModel;