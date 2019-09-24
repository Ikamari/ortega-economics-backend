// Database
const { model } = require("mongoose");
// Jobs
const Craft = require("../../jobs/Craft")
// Controller foundation
const Controller = require("../Controller");
const { body }   = require('express-validator');

class CraftController extends Controller {

    createRoutes(router, Model) {

        router.post("/:building_id/craft/finish", [
            body("craft_process_id").exists()
        ], (request, response, next) => {
            if (!this.checkValidation(request, next)) return;
            model("Building").findById(request.params.building_id)
                .then(async (building) => {
                    if (!building) return response.status(404).send("Can't find specified building");

                    const craftProcess = building.craft_processes.filter((craftProcess) => {
                        return craftProcess._id.toString() === request.body.craft_process_id;
                    }).pop();
                    if (!craftProcess) return response.status(400).send("Can't find specified craft process");

                    Craft.finish(
                        null,
                        building,
                        craftProcess,
                        true
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));
                }).catch(error => next(error))
        });

        router.post("/:building_id/craft/cancel", [
            body("craft_process_id").exists()
        ], (request, response, next) => {
            if (!this.checkValidation(request, next)) return;
            model("Building").findById(request.params.building_id)
                .then(async (building) => {
                    if (!building) return response.status(404).send("Can't find specified building");

                    const craftProcess = building.craft_processes.filter((craftProcess) => {
                        return craftProcess._id.toString() === request.body.craft_process_id;
                    }).pop();
                    if (!craftProcess) return response.status(400).send("Can't find specified craft process");

                    Craft.cancel(
                        null,
                        building,
                        craftProcess,
                        true
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));
                }).catch(error => next(error))
        });

        router.post("/:building_id/craft/rework", [
            body("craft_process_id").exists()
        ], (request, response, next) => {
            if (!this.checkValidation(request, next)) return;
            model("Building").findById(request.params.building_id)
                .then(async (building) => {
                    if (!building) return response.status(404).send("Can't find specified building");

                    const craftProcess = building.craft_processes.filter((craftProcess) => {
                        return craftProcess._id.toString() === request.body.craft_process_id;
                    }).pop();
                    if (!craftProcess) return response.status(400).send("Can't find specified craft process");

                    Craft.rework(
                        null,
                        building,
                        craftProcess,
                        true
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));
                }).catch(error => next(error))
        });

    }

}

module.exports = CraftController;