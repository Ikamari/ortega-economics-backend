// Controller foundation
const ServerController = require("../ServerController");
const { wrap } = require("../Controller");
const { body } = require('express-validator');
// Database
const { model } = require("mongoose");

class FacilitesController extends ServerController {

    createRoutes() {
        // Get all facilities
        this.router.get("/", wrap(async (request, response, next) => {
            return response.status(200).send(
                await model("Facility").find({})
            );
        }));
    }

}

module.exports = FacilitesController;