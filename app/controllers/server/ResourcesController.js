// Controller foundation
const ServerController = require("../ServerController");
const { wrap } = require("../Controller");
// Database
const { model } = require("mongoose");

class ResourcesController extends ServerController {

    createRoutes() {
        // Get all resources
        this.router.get("/", wrap(async (request, response, next) => {
            return response.status(200).send(
                await model("Resource").find({}).select("_id name")
            );
        }));

        // Get info about resource
        this.router.get("/:resource_id", wrap(async (request, response, next) => {
            const resource = await model("Resource").findById(request.params.resource_id);
            return resource ?
                response.status(200).send(resource) :
                response.status(404).send("Not found")
        }));
    }

}

module.exports = ResourcesController;