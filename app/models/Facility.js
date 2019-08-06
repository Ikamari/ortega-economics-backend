// Database
const { Schema, model } = require("mongoose");
const Int32 = require("mongoose-int32");

const TYPE_IDS = {
    1: "Engineering", "Engineering": 1,
    2: "Laboratory",  "Laboratory":  2,
    3: "Casting",     "Casting":     3,
};

const FacilityModel = model("Facility", new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type_id: {
        type: Int32,
        default: null
    }
}));

const getFacilitiesMap = (propertyToUse = "name") => {
    return new Promise((resolve, reject) =>
        model("Facility").find({})
            .then((resources) => {
                const facilitiesMap = {};
                resources.map((facility) => {
                    facilitiesMap[propertyToUse === "_id" ? facility._id.toString() : facility[propertyToUse]] = facility;
                });
                resolve(facilitiesMap);
            })
            .catch(error => reject(error))
    )
};

module.exports = FacilityModel;
module.exports.TYPE_IDS = TYPE_IDS;
module.exports.getFacilitiesMap = getFacilitiesMap;