// Database
const { model } = require("mongoose");
// Helpers
const { mergeResources } = require("../helpers/ResourcesHelper");
// Exception
const ErrorResponse = require("@controllers/ErrorResponse");

const handleBuilding = async (building, waterID, foodID) => {
    if (!building.is_active) {
        throw new ErrorResponse("Building is not active");
    }
    if (building.used_storage >= building.storage_size) {
        throw new ErrorResponse("Building doesn't have any space in storage");
    }

    // Count how much resources will be consumed by the building
    let resourcesToConsume = {};
    let moneyToConsume;
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
        resourcesToConsume[waterID] = {
            _id: waterID,
            amount: -(building.workers_consumption.water * building.used_workplaces)
        };
        resourcesToConsume[foodID] = {
            _id: foodID,
            amount: -(building.workers_consumption.food * building.used_workplaces)
        };
        moneyToConsume = -(building.workers_consumption.money);
    });
    resourcesToConsume = Object.values(resourcesToConsume);

    // Count how much resources will be produced by the building
    let resourcesToProduce = {};
    let moneyToProduce;
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
        };
        moneyToProduce = building.money_production;
    });
    resourcesToProduce = Object.values(resourcesToProduce);
    building.money -= moneyToConsume+moneyToConsume;

    // Remove resources from fraction and add as much as possible resources to the building
    await building.editResources(mergeResources(resourcesToProduce, resourcesToConsume), false);
    
};

const handleBuildings = (buildings, throwException = false) => {   
    return Promise.all(buildings.map((async(building) => {
        let waterID, foodID;
        await model("Resource").findOne({ name: "Вода" }), async function (err, resource) {
            err(new ErrorResponse("The building doesn't have enough water"));
            waterID = resource._id;
        };
        await model("Resource").findOne({ name: "Пища" }), async function (err, resource) {
            err(new ErrorResponse("The building doesn't have enough food"));
            foodID = resource._id;
        };
        return handleBuilding(building, waterID, foodID)
            .then(() => {
                console.log(`Successfully finished production cycle for building ${building._id}`);
            })
            .catch((e) => {
                console.log(`Failed to finish production cycle for building ${building._id}: ${e.message}`);
                if (throwException) throw e;
            });
    })));
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