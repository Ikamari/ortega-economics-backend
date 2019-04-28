// Server
const express    = require("express");
const bodyParser = require("body-parser");
// Database
const mongoose = require("mongoose");

const createObjectId = (request, response) => {
    try {
        return mongoose.Types.ObjectId(request.params.id)
    }
    catch {
        response.status(500).send(`Can't create ObjectId from specified id`);
        return false
    }
};

const createAdminController = (Model) => {
    const router = express.Router();

    router.use(bodyParser.urlencoded({extended: true}));
    router.use(bodyParser.json());

    router.get("/", (request, response) => {
        Model.find({}, (error, resources) => {
            if (error) {
                return response.status(500).send(`Can't get documents of ${Model.collection.collectionName} collection: ${error.message}`);
            }
            response.status(200).send(request.params.id ? resources[0] : resources);
        })
    });

    router.get("/:id", (request, response) => {
        let objectId;
        if (!(objectId = createObjectId(request, response))) {
            return
        }

        Model.find({ _id: objectId }, (error, resources) => {
            if (error) {
                return response.status(500).send(`Can't get specified document of ${Model.collection.collectionName} collection: ${error.message}`);
            }
            if (!resources.length) {
                return response.status(500).send(`Can't find document of ${Model.collection.collectionName} collection with specified id`);
            }
            response.status(200).send(request.params.id ? resources[0] : resources);
        })
    });

    router.post("/", (request, response) => {
        Model.create(request.body, (error, resource) => {
            if (error) {
                return response.status(500).send(`Can't create new document of ${Model.collection.collectionName} collection: ${error.message}`);
            }
            response.status(200).send(resource);
        })
    });

    router.patch("/:id", (request, response) => {
        let objectId;
        if (!(objectId = createObjectId(request, response))) {
            return
        }

        Model.findByIdAndUpdate(objectId, request.body, (error, resource) => {
            if (error) {
                return response.status(500).send(`Can't update specified document of ${Model.collection.collectionName} collection: ${error.message}`);
            }
            if (!resource.length) {
                return response.status(500).send(`Can't find document of ${Model.collection.collectionName} collection with specified id`);
            }
            response.status(200).send(resource);
        })
    });

    router.delete("/:id", (request, response) => {
        let objectId;
        if (!(objectId = createObjectId(request, response))) {
            return
        }

        Model.findByIdAndDelete(objectId, (error, resource) => {
            if (error) {
                return response.status(500).send(`Can't delete specified document of ${Model.collection.collectionName} collection: ${error.message}`);
            }
            if (!resource.length) {
                return response.status(500).send(`Can't find document of ${Model.collection.collectionName} collection with specified id`);
            }
            response.status(200).send(resource);
        })
    });

    return router
};

module.exports = createAdminController;