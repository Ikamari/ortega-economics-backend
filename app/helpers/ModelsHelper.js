// Database
const { model } = require("mongoose");

const getRecordsMap = (modelName, propertyToUse = "name", filterFunction) => {
    const useFilter = filterFunction instanceof Function;
    return new Promise((resolve, reject) =>
        model(modelName).find({})
            .then((records) => {
                const recordsMap = {};
                records.map((record) => {
                    if (useFilter && !filterFunction(record)) return;
                    recordsMap[propertyToUse === "_id" ? record._id.toString() : record[propertyToUse]] = record;
                });
                resolve(recordsMap);
            })
            .catch(error => reject(error))
    )
}

module.exports.getRecordsMap = getRecordsMap