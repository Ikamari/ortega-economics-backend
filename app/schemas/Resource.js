// Database
const { Schema } = require("mongoose");

module.exports = new Schema({
    resource_id: {
        // todo: add id validation
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
});