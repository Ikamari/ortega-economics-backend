// Controller foundation
const ServerController = require("../ServerController");
const { wrap } = require("../Controller");
const { body } = require('express-validator');
// Database
const { model } = require("mongoose");
// Helpers
const { getRecordsMap } = require("../../helpers/ModelsHelper");

class FractionsController extends ServerController {

    createRoutes() {
        // Get all fractions
        this.router.get("/", wrap(async (request, response, next) => {
            return response.status(200).send(
                await model("Fraction").find({}).select("_id name")
            );
        }));

        // Get info about fraction
        this.router.get("/:fraction_id", wrap(async (request, response, next) => {
            const fraction = await model("Fraction").findById(request.params.fraction_id);
            return fraction ?
                response.status(200).send(fraction) :
                response.status(404).send("Not found")
        }));

        // Create new fraction
        this.router.post("/", [
            body("name").isString().exists()
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const fraction = await model("Fraction").create({
                name: request.body.name
            });
            return response.status(200).send(fraction);
        }));

        // Update fraction info
        this.router.patch("/:fraction_id", [
            body("name").isString().optional()
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const fraction = await model("Fraction").findById(request.params.fraction_id);
            if (!fraction) return response.status(404).send("Not found");

            this.updateIfDefined(fraction, "name", request.body.name);
            await fraction.save();

            return response.status(200).send(fraction);
        }));

        // (UNSAFE) Delete fraction
        this.router.delete("/:fraction_id", wrap(async (request, response, next) => {
            const fraction = await model("Fraction").findById(request.params.fraction_id);
            if (!fraction) return response.status(404).send("Not found");

            await fraction.delete();
            return response.status(200).send(true);
        }));

        // Add trait to fraction
        this.router.post("/:fraction_id/traits", [
            body("trait_id").isString().exists(true, true)
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const fraction = await model("Fraction").findById(request.params.fraction_id);
            if (!fraction) return response.status(404).send("Not found");
            const result = fraction.addTrait(request.body.trait_id);
            await fraction.save();

            return response.status(200).send(result);
        }));

        // Remove trait from fraction
        this.router.delete("/:fraction_id/traits", [
            body("trait_id").isString().exists(true, true)
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const fraction = await model("Fraction").findById(request.params.fraction_id);
            if (!fraction) return response.status(404).send("Not found");
            const result = fraction.removeTrait(request.body.trait_id);
            await fraction.save();

            return response.status(200).send(result);
        }));

        // Get list of fraction buildings
        this.router.get("/:fraction_id/buildings", wrap(async (request, response, next) => {
            const fraction = await model("Fraction").findById(request.params.fraction_id);
            if (!fraction) return response.status(404).send("Not found");
            return response.status(200).send(await fraction.buildings.select("_id name"));
        }));

        // Get list of resources from fraction buildings
        this.router.get("/:fraction_id/resources", wrap(async (request, response, next) => {
            const fraction = await model("Fraction").findById(request.params.fraction_id);
            if (!fraction) return response.status(404).send("Not found");

            const existingResources = await getRecordsMap("Resource", "_id");
            const fractionResources = await fraction.resources;
            const resources = Object.keys(fractionResources).map((id) => {
                return {
                    _id:    id,
                    amount: fractionResources[id],
                    name:   existingResources[id].name
                }
            });

            return response.status(200).send(resources);
        }));

        // Get list of fraction members
        this.router.get("/:fraction_id/members", wrap(async (request, response, next) => {
            const fraction = await model("Fraction").findById(request.params.fraction_id);
            if (!fraction) return response.status(404).send("Not found");
            return response.status(200).send(await fraction.members.select("_id name"));
        }));

        // Get list of free fraction members
        this.router.get("/:fraction_id/free-members", wrap(async (request, response, next) => {
            const fraction = await model("Fraction").findById(request.params.fraction_id);
            if (!fraction) return response.status(404).send("Not found");
            return response.status(200).send(await fraction.free_members.select("_id name"));
        }));
    }

}

module.exports = FractionsController;