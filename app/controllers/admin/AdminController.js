// Server
const express    = require("express");
const bodyParser = require("body-parser");
// Database
const mongoose = require("mongoose");

const createAdminController = (Model) => {
    const router = express.Router();

    router.use(bodyParser.urlencoded({extended: true}));
    router.use(bodyParser.json());

    router.get("/:id*?", (request, response) => {
        let conditions;
        try {
            conditions = request.params.id ? {_id: mongoose.Types.ObjectId(request.params.id)} : {}
        }
        catch {
            return response.status(500).send(`Can't create ObjectId from specified id`)
        }

        Model.find(conditions, (error, resources) => {
            if (error) {
                return response.status(500).send(`Can't get ${request.params.id ? "specified document" : "documents"} of ${Model.collection.collectionName} collection: ${error.message}`);
            }
            if (!resources.length) {
                return response.status(500).send(`Can't find document of ${Model.collection.collectionName} collection with specified id`);
            }
            response.status(200).send(request.params.id ? resources[0] : resources);
        })
    });

    router.post("/", (request, response) => {
        Model.create({
            name: request.body.name
        }, (error, resource) => {
            if (error) {
                return response.status(500).send(`Can't create new document of ${Model.collection.collectionName} collection: ${error.message}`);
            }
            response.status(200).send(resource);
        })
    });

    router.delete("/:id", (request, response) => {
        let objectId;
        try {
            objectId = mongoose.Types.ObjectId(request.params.id)
        }
        catch {
            return response.status(500).send(`Can't create ObjectId from specified id`)
        }

        Model.findByIdAndDelete(objectId, (error, resource) => {
            if (error) {
                return response.status(500).send(`Can't delete specified document of ${Model.collection.collectionName} collection: ${error.message}`);
            }
            response.status(200).send(resource);
        })
    });

    return router
};

module.exports = createAdminController;