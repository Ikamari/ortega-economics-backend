// Database
const { Schema, model } = require("mongoose");

// todo: check whether resource can be deleted (check it's usage in blueprints and other models)
const ResourceModel = model("Resource", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}));

module.exports = ResourceModel;