// Database
const { Schema } = require("mongoose");
// Validators
const { exists } = require("../../validators/General");

const FacilitySchema = new Schema({
    facility_type_id: {
        validate: exists("FacilityType"),
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = FacilitySchema;