// Controller foundation
const ServerController = require("../ServerController");

class TestController extends ServerController {

    createRoutes() {
        this.router.get("/", (request, response, next) => {
            response.status(200).send("You shouldn't see that")
        });
    }

}

module.exports = TestController;