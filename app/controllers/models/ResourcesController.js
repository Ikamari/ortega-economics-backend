// Database
const { model }  = require("mongoose");
// Controller foundation
const Controller = require("../Controller");

class ResourcesController extends Controller {
    createRoutes(router) {
        router.get("/", (request, response, next) => {
            model("Resource").find({}, (error, documents) => {
                response.status(200).send(documents);
            }).catch(error => next(error))
        });
    }
}

module.exports = ResourcesController;