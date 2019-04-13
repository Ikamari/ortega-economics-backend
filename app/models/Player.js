// Database
const { Schema, model } = require("mongoose");

module.exports = model("Player", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fraction_id: {
        // todo: add id validation
        type: Schema.Types.ObjectId,
        default: null
    },
    perks: {
        // todo: add id validation
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    }
}));