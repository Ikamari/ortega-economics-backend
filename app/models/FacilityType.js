// Database
const { Schema, model } = require("mongoose");

const FacilityTypeModel = model("FacilityType", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    is_universal: {
        type: Boolean,
        required: true,
        default: false
    }
}));

module.exports = FacilityTypeModel;