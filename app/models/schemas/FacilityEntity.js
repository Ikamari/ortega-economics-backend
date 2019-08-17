// Database
const { Schema } = require("mongoose");
// Validators
const { exists } = require("../../validators/General");

const FacilityEntitySchema = new Schema({
    facility_id: {
        type: Schema.Types.ObjectId,
        validate: exists("Facility"),
        required: true
    }
});

module.exports = FacilityEntitySchema;