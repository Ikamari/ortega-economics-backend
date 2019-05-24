// Database
const { model }  = require("mongoose");
// Controller foundation
const Controller = require("../Controller");
// Jobs
const Production = require("../../jobs/Production")

class ProductionController extends Controller {

    createRoutes(router, Model) {
        router.get("/force-production-cycle/building/:id", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send(`Can't find specified building`);
                    }
                    Production.handleBuilding(building)
                        .then(() => response.status(200).send("Ok!"))
                        .catch(error => next(error));
                }).catch(error => next(error))
        });

        router.get("/force-production-cycle/fraction/:id", (request, response, next) => {
            model("Fraction").findById(request.params.id)
                .then((fraction) => {
                    if (!fraction) {
                        return response.status(404).send(`Can't find specified fraction`);
                    }
                    Production.handleFraction(fraction)
                        .then(() => response.status(200).send("Ok!"))
                        .catch(error => next(error));
                }).catch(error => next(error))
        });

        router.get("/force-production-cycle", (request, response, next) => {
            Production.handleFractions(false)
                .then(() => response.status(200).send("Ok!"))
                .catch(error => next(error));
        });
    }

}

module.exports = ProductionController;