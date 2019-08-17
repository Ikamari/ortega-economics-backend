// Database
const { model } = require("mongoose");

const getRecordsMap = (modelName, propertyToUse = "name") => {
    return new Promise((resolve, reject) =>
        model(modelName).find({})
            .then((records) => {
                const recordsMap = {};
                records.map((record) => {
                    recordsMap[propertyToUse === "_id" ? record._id.toString() : record[propertyToUse]] = record;
                });
                resolve(recordsMap);
            })
            .catch(error => reject(error))
    )
}

module.exports.getRecordsMap = getRecordsMap