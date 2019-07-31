const hasObjectId = (arrayOfObjectId, objectId) => {
    return arrayOfObjectId.some((element) => element.equals(objectId))
}

module.exports.hasObjectId = hasObjectId