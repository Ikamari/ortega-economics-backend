// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");
// Validators
const { exists } = require("../validators/General");

const BlueprintEntitySchema = new Schema({
    blueprint_id: {
        type: Schema.Types.ObjectId,
        validate: exists("Blueprint"),
        required: true
    },
    quality: {
        type: Int32,
        default: 0,
        max: 20,
        min: 0,
        required: true
    }
})

BlueprintEntitySchema.virtual("blueprint").get(async function () {
    return await model("Blueprint").findOne({ _id: this.blueprint_id });
})

const BlueprintEntityModel = model("BlueprintEntity", BlueprintEntitySchema);

module.exports = BlueprintEntityModel;