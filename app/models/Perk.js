// Database
const { Schema, model } = require("mongoose");

module.exports = model("Perk", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}));