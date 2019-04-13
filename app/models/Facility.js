// Database
const { Schema, model } = require("mongoose");

module.exports = model("Facility", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}));