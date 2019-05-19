const mergeResources = (resources) => {
    let merged = {};
    resources.map((resource) => {
        if (resource._id in merged) {
            merged[resource._id].amount += resource.amount;
        } else {
            merged[resource._id] = {
                _id:    resource._id,
                amount: resource.amount
            }
        }
    });
    return Object.values(merged)
}

const sortResources = (resources, direction = "asc") => {
    const dir = direction === "asc" ? 1 : -1
    return resources.sort((a, b) =>
        (a.amount > b.amount) ? dir : ((b.amount > a.amount) ? -dir : 0)
    );
}

module.exports.sortResources  = sortResources;
module.exports.mergeResources = mergeResources;