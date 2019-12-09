// Database
const { model } = require("mongoose");
// Helpers
const { mergeResources } = require("../helpers/ResourcesHelper");
// Exception
const ErrorResponse = require("@controllers/ErrorResponse");

const handleBuilding = async (building) => {
    if (!building.is_active) {
        throw new ErrorResponse("Specified building is inactive");
    }
    if (building.used_storage >= building.storage_size) {
        throw new ErrorResponse("Specified building doesn't have any space in storage", 500);
    }

    // Count how much resources will be consumed by the building
    let resourcesToConsume = {};
    building.consumes.map((turnover) => {
        // Roll the dice to check whether specific resource should be consumed
        if (Math.random() > turnover.chance) return;
        if (turnover.resource_id in resourcesToConsume) {
            resourcesToConsume[turnover.resource_id].amount -= turnover.amount;
        } else {
            resourcesToConsume[turnover.resource_id] = {
                _id: turnover.resource_id,
                amount: -turnover.amount
            };
        }
    });
    resourcesToConsume = Object.values(resourcesToConsume);

    // Count how much resources will be produced by the building
    let resourcesToProduce = {};
    building.produces.map((turnover) => {
        // Roll the dice to check whether specific resource should be produced
        if (Math.random() > turnover.chance) return;
        if (turnover.resource_id in resourcesToProduce) {
            resourcesToProduce[turnover.resource_id].amount += turnover.amount;
        } else {
            resourcesToProduce[turnover.resource_id] = {
                _id: turnover.resource_id,
                amount: turnover.amount
            };
        }
    });
    resourcesToProduce = Object.values(resourcesToProduce);

    // Remove resources from fraction and add as much as possible resources to the building
    await building.editResources(mergeResources(resourcesToProduce, resourcesToConsume), false);
};

const handleBuildings = (buildings, throwException = false) => {
    return Promise.all(buildings.map((building) => {
        return handleBuilding(building)
            .then(() => {
                console.log(`Successfully finished production cycle for building ${building._id}`);
            })
            .catch((e) => {
                console.log(`Failed to finish production cycle for building ${building._id}: ${e.message}`);
                if (throwException) throw e;
            });
    }));
};

const handleCharacter = async (characterId, throwException = false) => {
    console.log("Finishing production cycle for buildings of specified character...");
    await handleBuildings(
        await model("Building").find({
            is_active:    true,
            character_id: characterId
        }),
        throwException
    );
    console.log("Done");
};

const handleFraction = async (fractionId, throwException = false) => {
    console.log("Finishing production cycle for buildings of specified fraction...");
    await handleBuildings(
        await model("Building").find({
            is_active:   true,
            fraction_id: fractionId
        }),
        throwException
    );
    console.log("Done");
};

const handleAllBuildings = async (throwException = false) => {
    console.log("Finishing production cycle for all buildings...");
    await handleBuildings(
        await model("Building").find({ is_active: true }),
        throwException
    );
    console.log("Done");
};

module.exports.handleFraction     = handleFraction;
module.exports.handleCharacter    = handleCharacter;
module.exports.handleAllBuildings = handleAllBuildings;
module.exports.handleBuilding     = handleBuilding;