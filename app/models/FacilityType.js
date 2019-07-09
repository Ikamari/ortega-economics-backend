// Database
const { Schema, model } = require("mongoose");

const FacilityTypeModel = model("FacilityType", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}));

module.exports = FacilityTypeModel;