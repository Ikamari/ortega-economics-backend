// Controller foundation
const ServerController = require("../ServerController");
const { wrap }         = require("../Controller");
// Database
const { model } = require("mongoose");

class TraitsController extends ServerController {

    createRoutes() {
        // Get all traits
        this.router.get("/", wrap(async (request, response, next) => {
            return response.status(200).send(
                await model("Trait").find({})
            );
        }));
    }

}

module.exports = TraitsController;