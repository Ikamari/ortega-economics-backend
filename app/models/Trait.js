// Database
const { Schema, model } = require("mongoose");

module.exports = model("Trait", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}));