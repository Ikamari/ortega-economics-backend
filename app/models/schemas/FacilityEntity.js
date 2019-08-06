// Database
const { Schema } = require("mongoose");
// Validators
const { exists } = require("../../validators/General");

const FacilityEntitySchema = new Schema({
    facility_id: {
        validate: exists("Facility"),
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = FacilityEntitySchema;