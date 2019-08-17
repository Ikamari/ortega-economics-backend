// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Validators
const { exists } = require("../validators/General");

const FacilityModel = model("Facility", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    quality_level: {
        type: Number,
        required: true,
        default: 0.25
    },
    tech_tier: {
        type: Int32,
        required: true
    },
    type_id: {
        type: Schema.Types.ObjectId,
        validate: exists("FacilityType"),
        required: true
    }
}));

module.exports = FacilityModel;