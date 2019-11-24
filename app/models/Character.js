// Database
const { Schema, model } = require("mongoose");
// Validators
const { exists } = require("../validators/General");

// todo: Fraction model has similar parts of code that should be replaced into one file

const CharacterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fraction_id: {
        type: Schema.Types.ObjectId,
        validate: exists("Fraction"),
        default: null
    },
    perks: {
        type: [Schema.Types.ObjectId],
        validate: exists("Perk"),
        required: true,
        default: []
    }
});

//region - Virtuals

// Get character's fraction
CharacterSchema.virtual("fraction").get(function () {
    return this.fraction_id ? model("Fraction").findById({ _id: this.fraction_id }) : null;
});

// Get all fraction buildings
CharacterSchema.virtual("buildings").get(function() {
    return model("Building").find({ character_id: this._id });
});

//endregion

//region - Fraction

CharacterSchema.methods.attachToFraction = async function(fractionId) {
    if (!fractionId || (this.fraction_id && this.fraction_id.equals(fractionId))) return true;

    // Check whether specified fraction exists
    const fraction = await model("Fraction").findById(fractionId);
    if (!fraction) throw new Error("Fraction with specified id doesn't exist");

    await this.detachFromFraction();

    this.fraction_id = fractionId;
    return true;
};

CharacterSchema.methods.detachFromFraction = async function() {
    if (!this.fraction_id) return true;

    // todo: pause all unfinished craft processes in which this customer participates

    this.fraction_id = null;
    return true;
};

//endregion

//region - Perks

CharacterSchema.methods.addPerk = function(perkId) {
    const index = this.hasPerk(perkId);
    if (index === false) {
        this.perks.push(perkId);
        return true;
    }
    return false;
};

CharacterSchema.methods.hasPerk = function(perkId) {
    const index = this.perks.indexOf(perkId);
    return index !== -1 ? index : false;
};

CharacterSchema.methods.removePerk = function(perkId) {
    const index = this.hasTrait(perkId);
    if (index !== false) {
        this.perks.splice(index, 1);
        return true;
    }
    return false;
};

//endregion

//region - Resources

// todo: add other functionality to add/remove/check resources

// Get resources from all fraction's buildings
CharacterSchema.virtual("resources").get(async function() {
    const buildings = await this.buildings;

    let resources = {};
    buildings.map((building) => {
        building.resources.forEach((value, key) => {
            if (key in resources) {
                resources[key] += value;
            } else {
                resources[key] = value;
            }
        })
    });

    return resources;
});

//endregion

const CharacterModel = model("Character", CharacterSchema);

module.exports = CharacterModel;