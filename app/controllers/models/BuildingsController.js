// Database
const { model }  = require("mongoose");
// Controller foundation
const Controller = require("../Controller");

class BuildingsController extends Controller {

    createRoutes(router) {
        router.get("/", (request, response, next) => {
            model("Building").find({})
                .then((buildings) => {
                    response.status(200).send(buildings);
                }).catch(error => next(error))
        });

        router.get("/:id", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send(`Can't find specified building`);
                    }
                    response.status(200).send(building);
                }).catch(error => next(error))
        });

        router.get("/:id/activate", (request, response, next) => {
            model("Building").findByIdAndUpdate(request.params.id, { is_active: true })
                .then((building) => {
                    if (!building) {
                        return response.status(404).send(`Can't find specified building`);
                    }
                    response.status(200).send(building);
                }).catch(error => next(error))
        });

        router.get("/:id/deactivate", (request, response, next) => {
            model("Building").findByIdAndUpdate(request.params.id, { is_active: false })
                .then((building) => {
                    if (!building) {
                        return response.status(404).send(`Can't find specified building`);
                    }
                    response.status(200).send(building);
                }).catch(error => next(error))
        });

        router.post("/:id/resources", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send(`Can't find specified building`);
                    }

                    building.editResources(
                        request.body.resources,
                        request.body.strictCheck
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });

        router.post("/:id/production", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send(`Can't find specified building`);
                    }

                    building.addProduction(
                        request.body
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });

        router.post("/:id/consumption", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send(`Can't find specified building`);
                    }

                    building.addConsumption(
                        request.body
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });

        router.delete("/:id/production/:turnoverId", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send(`Can't find specified building`);
                    }

                    building.removeProduction(
                        request.params.turnoverId
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });

        router.delete("/:id/consumption/:turnoverId", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send(`Can't find specified building`);
                    }

                    building.removeConsumption(
                        request.params.turnoverId
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });
    }

}

module.exports = BuildingsController;