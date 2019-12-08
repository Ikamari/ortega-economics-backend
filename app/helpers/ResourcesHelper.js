const mergeResources = (...resourcesArrays) => {
    let merged = {};
    resourcesArrays.map((resourcesArray) => {
        resourcesArray.map((resource) => {
            if (resource._id in merged) {
                merged[resource._id].amount += resource.amount;
            } else {
                merged[resource._id] = {
                    _id:    resource._id,
                    amount: resource.amount
                }
            }
        })
    });
    return Object.values(merged)
};

const sortResources = (resources, direction = "asc") => {
    const dir = direction === "asc" ? 1 : -1;
    return resources.sort((a, b) =>
        (a.amount > b.amount) ? dir : ((b.amount > a.amount) ? -dir : 0)
    );
};

const invertResources = (resources) => {
    resources.forEach(function (resource, index) {
        this[index].amount *= -1
    }, resources);
    return resources;
};

const countResources = (resources) => {
    let amount = 0;
    resources.map((resource) => {
        amount += resource.amount;
    });
    return amount;
};

module.exports.sortResources   = sortResources;
module.exports.mergeResources  = mergeResources;
module.exports.invertResources = invertResources;
module.exports.countResources  = countResources;