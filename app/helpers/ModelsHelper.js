const getRecordsMap = (modelName, propertyToUse = "name") => {
    return new Promise((resolve, reject) =>
        model(modelName).find({})
            .then((resources) => {
                const facilitiesMap = {};
                resources.map((facility) => {
                    facilitiesMap[propertyToUse === "_id" ? facility._id.toString() : facility[propertyToUse]] = facility;
                });
                resolve(facilitiesMap);
            })
            .catch(error => reject(error))
    )
}

module.exports.getRecordsMap = getRecordsMap