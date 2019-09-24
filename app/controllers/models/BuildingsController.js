// Database
const { model } = require("mongoose");
// Jobs
const Craft = require("../../jobs/Craft")
// Controller foundation
const Controller = require("../Controller");
const { body }   = require('express-validator');

class BuildingsController extends Controller {

    createRoutes(router) {
        router.get("/", (request, response, next) => {
            model("Building").find({})
                .then((buildings) => {
                    response.status(200).send(buildings);
                }).catch(error => next(error))
        });

        router.get("/:id", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send("Can't find specified building");
                    }
                    response.status(200).send(building);
                }).catch(error => next(error))
        });

        router.get("/:id/activate", (request, response, next) => {
            model("Building").findByIdAndUpdate(request.params.id, { is_active: true })
                .then((building) => {
                    if (!building) {
                        return response.status(404).send("Can't find specified building");
                    }
                    response.status(200).send(building);
                }).catch(error => next(error))
        });

        router.get("/:id/deactivate", (request, response, next) => {
            model("Building").findByIdAndUpdate(request.params.id, { is_active: false })
                .then((building) => {
                    if (!building) {
                        return response.status(404).send("Can't find specified building");
                    }
                    response.status(200).send(building);
                }).catch(error => next(error))
        });

        router.post("/:id/resources", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send("Can't find specified building");
                    }

                    building.editResources(
                        request.body.resources,
                        request.body.strictCheck
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });

        router.post("/:id/production", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send("Can't find specified building");
                    }

                    building.addProduction(
                        request.body
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });

        router.post("/:id/consumption", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send("Can't find specified building");
                    }

                    building.addConsumption(
                        request.body
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });

        router.post("/:id/craft/by-blueprint", [
            body("character_id").exists(),
            body("blueprint_entity_id").exists(),
            body("participants").exists().isArray(),
            body("resources_multiplier").exists()
        ], (request, response, next) => {
            if (!this.checkValidation(request, next)) return;
            model("Building").findById(request.params.id)
                .then(async (building) => {
                    if (!building) return response.status(404).send("Can't find specified building");

                    const character = await model("Character").findById(request.body.character_id)
                    if (!character) return response.status(400).send("Can't find specified character");

                    const blueprintEntity = await model("BlueprintEntity").findById(request.body.blueprint_entity_id)
                    if (!blueprintEntity) return response.status(400).send("Can't find specified blueprint entity");

                    Craft.startByBlueprint(
                        character,
                        building,
                        blueprintEntity,
                        request.body.participants,
                        request.body.resources_multiplier
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));
                }).catch(error => next(error))
        });

        router.post("/:id/craft/by-recipe", [
            body("character_id").exists(),
            body("recipe_id").exists(),
            body("quantity").exists().isNumeric()
        ], (request, response, next) => {
            if (!this.checkValidation(request, next)) return;
            model("Building").findById(request.params.id)
                .then(async (building) => {
                    if (!building) return response.status(404).send("Can't find specified building");

                    const character = await model("Character").findById(request.body.character_id)
                    if (!character) return response.status(400).send("Can't find specified character");

                    const recipe = await model("Recipe").findById(request.body.recipe_id)
                    if (!recipe) return response.status(400).send("Can't find specified recipe");

                    Craft.startByRecipe(
                        character,
                        building,
                        recipe,
                        request.body.quantity
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));
                }).catch(error => next(error))
        });

        router.post("/:id/craft/finish", [
            body("character_id").exists(),
            body("craft_process_id").exists()
        ], (request, response, next) => {
            if (!this.checkValidation(request, next)) return;
            model("Building").findById(request.params.id)
                .then(async (building) => {
                    if (!building) return response.status(404).send("Can't find specified building");

                    const character = await model("Character").findById(request.body.character_id)
                    if (!character) return response.status(400).send("Can't find specified character");

                    const craftProcess = building.craft_processes.filter((craftProcess) => {
                        return craftProcess._id.toString() === request.body.craft_process_id;
                    }).pop();
                    if (!craftProcess) return response.status(400).send("Can't find specified craft process");

                    Craft.finish(
                        character,
                        building,
                        craftProcess
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));
                }).catch(error => next(error))
        });

        router.post("/:id/craft/cancel", [
            body("character_id").exists(),
            body("craft_process_id").exists()
        ], (request, response, next) => {
            if (!this.checkValidation(request, next)) return;
            model("Building").findById(request.params.id)
                .then(async (building) => {
                    if (!building) return response.status(404).send("Can't find specified building");

                    const character = await model("Character").findById(request.body.character_id)
                    if (!character) return response.status(400).send("Can't find specified character");

                    const craftProcess = building.craft_processes.filter((craftProcess) => {
                        return craftProcess._id.toString() === request.body.craft_process_id;
                    }).pop();
                    if (!craftProcess) return response.status(400).send("Can't find specified craft process");

                    Craft.cancel(
                        character,
                        building,
                        craftProcess
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));
                }).catch(error => next(error))
        });

        router.post("/:id/craft/rework", [
            body("character_id").exists(),
            body("craft_process_id").exists()
        ], (request, response, next) => {
            if (!this.checkValidation(request, next)) return;
            model("Building").findById(request.params.id)
                .then(async (building) => {
                    if (!building) return response.status(404).send("Can't find specified building");

                    const character = await model("Character").findById(request.body.character_id)
                    if (!character) return response.status(400).send("Can't find specified character");

                    const craftProcess = building.craft_processes.filter((craftProcess) => {
                        return craftProcess._id.toString() === request.body.craft_process_id;
                    }).pop();
                    if (!craftProcess) return response.status(400).send("Can't find specified craft process");

                    Craft.rework(
                        character,
                        building,
                        craftProcess
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));
                }).catch(error => next(error))
        });

        router.delete("/:id/production/:turnoverId", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send("Can't find specified building");
                    }

                }).catch(error => next(error))
        });

        router.delete("/:id/consumption/:turnoverId", (request, response, next) => {
            model("Building").findById(request.params.id)
                .then((building) => {
                    if (!building) {
                        return response.status(404).send("Can't find specified building");
                    }

                    building.removeConsumption(
                        request.params.turnoverId
                    ).then(result => {
                        response.status(200).send(result)
                    }).catch(error => next(error));

                }).catch(error => next(error))
        });
    }

}

module.exports = BuildingsController;