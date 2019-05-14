// Database
const { model }  = require("mongoose");
// Controller foundation
const Controller = require("../Controller");

class BuildingsController extends Controller {

    createRoutes(router) {
        router.get("/", (request, response, next) => {
            model("Building").find({}, (error, documents) => {
                response.status(200).send(documents);
            }).catch(error => next(error))
        });

        router.get("/:id", (request, response, next) => {
            model("Building").findById(request.params.id, (error, document) => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }
                response.status(200).send(document);
            }).catch(error => next(error))
        });

        router.post("/:id/resources", (request, response, next) => {
            model("Building").findById(request.params.id).then((document) => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }

                document.editResources(
                    request.body.resources,
                    request.body.strictCheck
                ).then(result => {
                    response.status(200).send(result)
                }).catch(error => next(error));

            }).catch(error => next(error))
        });

        router.post("/:id/production", (request, response, next) => {
            model("Building").findById(request.params.id).then((document) => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }

                document.addProduction(
                    request.body
                ).then(result => {
                    response.status(200).send(result)
                }).catch(error => next(error));

            }).catch(error => next(error))
        });

        router.post("/:id/consumption", (request, response, next) => {
            model("Building").findById(request.params.id).then((document) => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }

                document.addConsumption(
                    request.body
                ).then(result => {
                    response.status(200).send(result)
                }).catch(error => next(error));

            }).catch(error => next(error))
        });

        router.delete("/:id/production/:turnoverId", (request, response, next) => {
            model("Building").findById(request.params.id).then((document) => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }

                document.removeProduction(
                    request.params.turnoverId
                ).then(result => {
                    response.status(200).send(result)
                }).catch(error => next(error));

            }).catch(error => next(error))
        });

        router.delete("/:id/consumption/:turnoverId", (request, response, next) => {
            model("Building").findById(request.params.id).then((document) => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }

                document.removeConsumption(
                    request.params.turnoverId
                ).then(result => {
                    response.status(200).send(result)
                }).catch(error => next(error));

            }).catch(error => next(error))
        });
    }

}

module.exports = BuildingsController;