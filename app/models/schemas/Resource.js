// Database
const { Schema } = require("mongoose");
const Int32 = require("mongoose-int32");
// Validators
const { exists } = require("../../validators/General");

const ResourceSchema = new Schema({
    _id: {
        validate: exists("Resource"),
        type: Schema.Types.ObjectId,
        required: true
    },
    amount: {
        type: Int32,
        required: true,
        default: 0
    }
});

module.exports = ResourceSchema;