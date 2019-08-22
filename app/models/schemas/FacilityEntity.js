// Database
const { Schema } = require("mongoose");
// Validators
const { exists } = require("../../validators/General");

const FacilityEntitySchema = new Schema({
    facility_id: {
        type: Schema.Types.ObjectId,
        validate: exists("Facility"),
        required: true
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    }
});

FacilityEntitySchema.virtual("properties", {
    ref:          "Facility",
    localField:   "facility_id",
    foreignField: "_id",
    justOne:      true
});

module.exports = FacilityEntitySchema;