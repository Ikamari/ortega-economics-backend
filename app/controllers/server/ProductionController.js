// Controller foundation
const ServerController = require("../ServerController");
const { wrap } = require("../Controller");
const { body } = require('express-validator');
// Database
const { model } = require("mongoose");
// Jobs
const Production = require("../../jobs/Production");

class ProductionController extends ServerController {


    createRoutes() {
        this.router.get("/force-production-cycle/building/:id", wrap(async(request, response, next) => {
            const building = model("Building").findById(request.params.id)
                    if (!building) return response.status(404).send(`Can't find specified building`);
                    Production.handleBuilding(building)
                        .then(() => response.status(200).send("Ok!"))
                        .catch(error => next(error));
        }));

        this.router.get("/force-production-cycle/fraction/:id", wrap(async(request, response, next) => {
            model("Fraction").findById(request.params.id)
                .then((fraction) => {
                    if (!fraction) {
                        return response.status(404).send(`Can't find specified fraction`);
                    }
                    Production.handleFraction(fraction)
                        .then(() => response.status(200).send("Ok!"))
                        .catch(error => next(error));
                }).catch(error => next(error))
        }));

        this.router.get("/force-production-cycle", wrap(async(request, response, next) => {
            Production.handleAllBuildings(false)
                .then(() => response.status(200).send("Ok!"))
                .catch(error => next(error));
        }));

    }

}

module.exports = ProductionController;