// Database
const { Schema } = require("mongoose");
// Models
const Resource = require("../models/Resource");
// Validators
const { exists } = require("../validators/General");

module.exports = new Schema({
    resource_id: {
        validate: exists(Resource),
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
});