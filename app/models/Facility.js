// Database
const { Schema, model } = require("mongoose");

const FacilityModel = model("Facility", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}));

module.exports = FacilityModel;