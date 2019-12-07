// Database
const { Schema } = require("mongoose");
const Int32 = require("mongoose-int32");
// Validators
const { exists } = require("../../validators/General");

const ResourceSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        validate: exists("Resource"),
        required: true
    },
    amount: {
        type: Int32,
        required: true,
        default: 0
    }
});

ResourceSchema.virtual("resource", {
    ref:          "Resource",
    localField:   "_id",
    foreignField: "_id",
    justOne:      true
});

ResourceSchema.set("toJSON", { transform: function(doc, ret, options) {
    if (options.includeResourceName && doc.resource) {
        ret.name = doc.resource.name;
    }
    return ret;
}});

module.exports = ResourceSchema;