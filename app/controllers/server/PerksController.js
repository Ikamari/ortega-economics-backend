// Controller foundation
const ServerController = require("../ServerController");
const { wrap } = require("../Controller");
const { body } = require('express-validator');
// Database
const { model } = require("mongoose");
// Helpers
const { getRecordsMap } = require("../../helpers/ModelsHelper");

class PerksController extends ServerController {

    createRoutes() {
        // Get all perks
        this.router.get("/", wrap(async (request, response, next) => {
            return response.status(200).send(
                await model("Perk").find({})
            );
        }));
    }

}

module.exports = PerksController;