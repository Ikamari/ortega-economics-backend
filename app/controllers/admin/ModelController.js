// Server
const express = require("express");
// Controller foundation
const Controller = require("../Controller");

class ModelController extends Controller {

    createRoutes(router, Model) {
        router.get("/", (request, response) => {
            Model.find({}, (error, documents) => {
                if (error) {
                    return response.status(404).send(`Can't get documents of ${Model.collection.collectionName} collection: ${error.message}`);
                }
                response.status(200).send(documents);
            })
        });

        router.get("/:id", (request, response) => {
            Model.findById(request.params.id, (error, document) => {
                if (error) {
                    return response.status(404).send(`Can't get specified document of ${Model.collection.collectionName} collection: ${error.message}`);
                }
                if (!document) {
                    return response.status(404).send(`Can't find document of ${Model.collection.collectionName} collection with specified id`);
                }
                response.status(200).send(document);
            })
        });

        router.post("/", (request, response) => {
            Model.create(request.body, (error, document) => {
                if (error) {
                    return response.status(404).send(`Can't create new document of ${Model.collection.collectionName} collection: ${error.message}`);
                }
                response.status(200).send(document);
            })
        });

        router.patch("/:id", (request, response) => {
            Model.findByIdAndUpdate(request.params.id, request.body, (error, document) => {
                if (error) {
                    return response.status(404).send(`Can't update specified document of ${Model.collection.collectionName} collection: ${error.message}`);
                }
                if (!document) {
                    return response.status(404).send(`Can't find document of ${Model.collection.collectionName} collection with specified id`);
                }
                response.status(200).send(document);
            })
        });

        router.delete("/:id", (request, response) => {
            Model.findByIdAndDelete(request.params.id, (error, document) => {
                if (error) {
                    return response.status(404).send(`Can't delete specified document of ${Model.collection.collectionName} collection: ${error.message}`);
                }
                if (!document) {
                    return response.status(404).send(`Can't find document of ${Model.collection.collectionName} collection with specified id`);
                }
                response.status(200).send(document);
            })
        });
    }

    getRouter(Model) {
        const router = express.Router();
        this.createRoutes(router, Model);
        return router;
    }

}

module.exports = ModelController;