// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Validators
const { exists } = require("../validators/General");

const ResourceSchema = new Schema({
    _id: {
        validate: exists(model("Resource")),
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Int32,
        required: true,
        default: 0
    }
});

module.exports = ResourceSchema;