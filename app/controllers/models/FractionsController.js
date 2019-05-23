// Database
const { model } = require("mongoose");
// Controller foundation
const Controller = require("../Controller");

class FractionsController extends Controller {

    createRoutes(router) {
        router.get("/", (request, response, next) => {
            model("Fraction").find({})
                .then((fractions) => {
                    response.status(200).send(fractions);
                }).catch(error => next(error))
        });

        router.get("/:id", (request, response, next) => {
            model("Fraction").findById(request.params.id)
                .then((fraction) => {
                    if (!fraction) {
                        return response.status(404).send(`Can't find specified fraction`);
                    }
                    response.status(200).send(fraction);
                }).catch(error => next(error))
        });

        // Get all fraction resources
        router.get("/:id/resources", (request, response, next) => {
            model("Fraction").findById(request.params.id)
                .then((fraction) => {
                    if (!fraction) {
                        return response.status(404).send(`Can't find specified fraction`);
                    }
                    fraction.resources.then((resources) => (
                        response.status(200).send(resources)
                    )).catch(error => next(error))
                }).catch(error => next(error));
        });

        // Get all fraction members
        router.get("/:id/members", (request, response, next) => {
            model("Fraction").findById(request.params.id)
                .then((fraction) => {
                    if (!fraction) {
                        return response.status(404).send(`Can't find specified fraction`);
                    }
                    fraction.members.then((members) => (
                        response.status(200).send(members)
                    )).catch(error => next(error))
                }).catch(error => next(error));
        });

        // Get all fraction buildings
        router.get("/:id/buildings", (request, response, next) => {
            model("Fraction").findById(request.params.id)
                .then((fraction) => {
                    if (!fraction) {
                        return response.status(404).send(`Can't find specified fraction`);
                    }
                    fraction.buildings.then((buildings) => (
                        response.status(200).send(buildings)
                    )).catch(error => next(error))
                }).catch(error => next(error));
        });

        // Get overall info about free/available storage space in buildings of fraction
        router.get("/:id/storage", (request, response, next) => {
            model("Fraction").findById(request.params.id)
                .then((fraction) => {
                    if (!fraction) {
                        return response.status(404).send(`Can't find specified fraction`);
                    }
                    fraction.storage.then((buildings) => (
                        response.status(200).send(buildings)
                    )).catch(error => next(error))
                }).catch(error => next(error));
        });

        router.post("/:id/resources", (request, response, next) => {
            model("Fraction").findById(request.params.id)
                .then((fraction) => {
                    if (!fraction) {
                        return response.status(404).send(`Can't find specified fraction`);
                    }

                    fraction.editResources(
                        request.body.resources,
                        request.body.strictCheck
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });
    }

}

module.exports = FractionsController;