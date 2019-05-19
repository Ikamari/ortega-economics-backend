const sortByPriority = (buildings, property, direction = "asc") => {
    const dir = direction === "asc" ? 1 : -1
    return buildings.sort((a, b) =>
        (a[property] > b[property]) ? dir : ((b[property] > a[property]) ? -dir : 0)
    );
}

const sortByStoragePriority = (buildings, direction = "asc") => {
    return sortByPriority(buildings, "storage_priority", direction)
}

const sortByProductionPriority = (buildings, direction = "asc") => {
    return sortByPriority(buildings, "production_priority", direction)
}

module.exports.sortByStoragePriority    = sortByStoragePriority;
module.exports.sortByProductionPriority = sortByProductionPriority;