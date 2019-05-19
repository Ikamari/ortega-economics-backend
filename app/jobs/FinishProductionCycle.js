// Database
const { model } = require("mongoose");

const handleBuilding = async (building, fraction = null, throwException = true) => {
    try {
        if (!building.is_active) {
            throw new Error("Specified building is inactive")
        }
        if (building.used_storage >= building.storage_size) {
            throw new Error("Specified building doesn't have any space in storage")
        }
        if (!building.fraction_id) {
            throw new Error("Specified building won't produce anything because it doesn't belong to any fraction")
        }
        if (!fraction) {
            fraction = await model("Fraction").findById(building.fraction_id);
        }

        // Count how much resources will be consumed by building
        let resourcesToConsume = {};
        building.consumes.map((turnover) => {
            // Roll the dice to check whether specific resource should be consumed
            if (Math.random() > turnover.chance) return;
            if (turnover.resource_id in resourcesToConsume) {
                resourcesToConsume[turnover.resource_id].amount -= turnover.amount;
            } else {
                resourcesToConsume[turnover.resource_id] = {
                    _id:    turnover.resource_id,
                    amount: - turnover.amount
                }
            }
        })
        resourcesToConsume = Object.values(resourcesToConsume);

        // Check whether fraction has such amount of resources
        await fraction.hasResources(resourcesToConsume);

        // Count how much resources will be produced by building
        let resourcesToProduce = {};
        building.produces.map((turnover) => {
            // Roll the dice to check whether specific resource should be consumed
            if (Math.random() > turnover.chance) return;
            if (turnover.resource_id in resourcesToProduce) {
                resourcesToProduce[turnover.resource_id].amount += turnover.amount;
            } else {
                resourcesToProduce[turnover.resource_id] = {
                    _id:    turnover.resource_id,
                    amount: turnover.amount
                }
            }
        })
        resourcesToProduce = Object.values(resourcesToProduce);

        // Remove resources from fraction and add as much as possible resources to the building
        await fraction.editResources(resourcesToConsume)
        await building.editResources(resourcesToProduce, false)
    } catch (e) {
        console.log("Failed to finish production cycle for building " + building._id + ": " + e.message)
        if (throwException) throw e;
        return false;
    }
    console.log("Finished production cycle for building:" + building._id + "")
    return true;
}

const handleFraction = (fraction, throwException = true) => {
    return new Promise((resolve, reject) =>
        fraction.buildings
            .then(buildings => {
                let buildingsToProcess = buildings.length;
                buildings.map(async (building) => await handleBuilding(building, fraction, throwException).then(() => {
                    buildingsToProcess--;
                    if (buildingsToProcess === 0) resolve(true)
                }).catch(error => reject(error)))
            }).catch(error => reject(error))
    )
}

const handleFractions = (throwException = false) => {
    console.log("Finishing production cycle for buildings...")
    return new Promise((resolve, reject) =>
        model("Fraction").find({})
            .then(fractions => {
                let fractionsToProcess = fractions.length;
                fractions.map((fraction) => handleFraction(fraction, throwException).then(() => {
                    fractionsToProcess--;
                    if (fractionsToProcess === 0) {
                        console.log("Finished production cycle for all valid buildings")
                        resolve(true);
                    }
                }).catch(error => reject(error)))
            }).catch(error => reject(error))
    )
};

module.exports.handleFraction  = handleFraction;
module.exports.handleBuilding  = handleBuilding;
module.exports.handleFractions = handleFractions