// Database
const { Schema, model } = require("mongoose");

const TraitModel = model("Trait", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}));

module.exports = TraitModel;