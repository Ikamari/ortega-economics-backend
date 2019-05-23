// Database
const { model }  = require("mongoose");
// Controller foundation
const Controller = require("../Controller");

class ResourcesController extends Controller {
    createRoutes(router) {
        router.get("/", (request, response, next) => {
            model("Resource").find({})
                .then((resources) => response.status(200).send(resources))
                .catch(error => next(error))
        });
    }
}

module.exports = ResourcesController;