// Database
const { Schema } = require("mongoose");
// Models
const ResourceModel = require("../models/Resource");
// Validators
const { exists } = require("../validators/General");

const ResourceSchema = new Schema({
    _id: {
        validate: exists(ResourceModel),
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = ResourceSchema;