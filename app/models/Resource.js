// Database
const { Schema, model } = require("mongoose");

module.exports = model("Resource", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}));