// Controller foundation
const ServerController = require("../ServerController");
const { wrap } = require("../Controller");
const { body } = require('express-validator');
// Database
const { model } = require("mongoose");

class BlueprintsController extends ServerController {

    createRoutes() {
        // Get all blueprints
        this.router.get("/", wrap(async (request, response, next) => {
            return response.status(200).send(
                await model("Blueprint").find({}).select("_id name")
            );
        }));

        // Get blueprint info
        this.router.get("/:blueprint_id", wrap(async (request, response, next) => {
            const blueprint = await model("Blueprint")
                .findById(request.params.blueprint_id)
                .populate("required_facilities.properties", "name")
                .populate("required_resources.properties", "name");
            return blueprint ?
                response.status(200).send(blueprint.toJSON({ includeFacilityName: true, includeResourceName: true })) :
                response.status(404).send("Not found.");
        }));

        // Get entities of blueprint
        this.router.get("/:blueprint_id/entities", wrap(async (request, response, next) => {
            const blueprint = await model("Blueprint").findById(request.params.blueprint_id);
            if (!blueprint) return response.status(404).send("Not found.");
            return response.status(200).send(await blueprint.entities)
        }));

        // Get blueprint entity info
        // Currently useless, because returns same data as "Get entities of blueprint" method and does more DB requests
        this.router.get("/:blueprint_id/entities/:entity_id", wrap(async (request, response, next) => {
            const blueprint = await model("Blueprint").findById(request.params.blueprint_id);
            if (!blueprint) return response.status(404).send("Not found.");

            return response.status(200).send(
                await blueprint.entities.find({ _id: request.params.entity_id })
            );
        }));

        // Create new blueprint entity
        this.router.post("/:blueprint_id/entities", [
            body("quality").isInt({ min: 0, max: 20 }).optional()
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const blueprintEntity = await model("BlueprintEntity").create({
                blueprint_id: request.params.blueprint_id,
                quality:      request.body.quality || 0
            });
            return response.status(200).send(blueprintEntity);
        }));

        // Edit blueprint entity
        this.router.patch("/:blueprint_id/entities/:entity_id", [
            body("quality").isInt({ min: 0, max: 20 }).optional()
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const blueprintEntity = await model("BlueprintEntity").findById(request.params.entity_id);
            if (!blueprintEntity) return response.status(404).send("No such entity");

            this.updateIfDefined(blueprintEntity, "quality", request.body.quality);
            await blueprintEntity.save();

            return response.status(200).send(blueprintEntity);
        }));

        // (UNSAFE) Delete blueprint entity
        this.router.delete("/:blueprint_id/entities/:entity_id", wrap(async (request, response, next) => {
            const blueprintEntity = await model("BlueprintEntity").findById(request.params.entity_id);
            if (!blueprintEntity) return response.status(404).send("No such entity");

            await blueprintEntity.delete();
            return response.status(200).send(true);
        }));

    }
}

module.exports = BlueprintsController;