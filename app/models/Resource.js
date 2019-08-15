// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");

// todo: check whether resource can be deleted (check it's usage in blueprints and other models)
const ResourceModel = model("Resource", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    min_price: {
        type: Int32,
        default: null
    },
    max_price: {
        type: Int32,
        default: null
    }
}));

module.exports = ResourceModel;