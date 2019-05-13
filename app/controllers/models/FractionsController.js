// Database
const { model } = require("mongoose");
// Controller foundation
const Controller = require("../Controller");

class FractionsController extends Controller {

    createRoutes(router) {
        router.get("/", (request, response, next) => {
            model("Fraction").find({}, (error, documents) => {
                response.status(200).send(documents);
            }).catch(error => next(error))
        });

        router.get("/:id", (request, response, next) => {
            model("Fraction").findById(request.params.id, (error, document) => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }
                response.status(200).send(document);
            }).catch(error => next(error))
        });

        // Get all fraction resources
        router.get("/:id/resources", (request, response, next) => {
            model("Fraction").findById(request.params.id).then(document => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }
                document.resources.then((resources) => (
                    response.status(200).send(resources)
                )).catch(error => next(error))
            }).catch(error => next(error));
        });

        // Get all fraction members
        router.get("/:id/members", (request, response, next) => {
            model("Fraction").findById(request.params.id).then(document => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }
                document.members.then((members) => (
                    response.status(200).send(members)
                )).catch(error => next(error))
            }).catch(error => next(error));
        });

        // Get all fraction buildings
        router.get("/:id/buildings", (request, response, next) => {
            model("Fraction").findById(request.params.id).then(document => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }
                document.buildings.then((buildings) => (
                    response.status(200).send(buildings)
                )).catch(error => next(error))
            }).catch(error => next(error));
        });

        // Get overall info about free/available storage space in buildings of fraction
        router.get("/:id/storage", (request, response, next) => {
            model("Fraction").findById(request.params.id).then(document => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }
                document.storage.then((buildings) => (
                    response.status(200).send(buildings)
                )).catch(error => next(error))
            }).catch(error => next(error));
        });

        router.post("/:id/resources", (request, response, next) => {
            model("Fraction").findById(request.params.id).then((document) => {
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
    }

}

module.exports = FractionsController;