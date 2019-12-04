// Controller foundation
const ServerController = require("../ServerController");
const { wrap } = require("../Controller");
const { body } = require('express-validator');
// Database
const { model } = require("mongoose");
// Helpers
const { getRecordsMap } = require("../../helpers/ModelsHelper");

class CharactersController extends ServerController {

    createRoutes() {
        // Get all characters
        this.router.get("/", wrap(async (request, response, next) => {
            return response.status(200).send(
                await model("Character").find({}).select("_id name")
            );
        }));

        // Get info about character
        this.router.get("/:character_id", wrap(async (request, response, next) => {
            const character = await model("Character").findById(request.params.character_id);
            return character ?
                response.status(200).send(character) :
                response.status(404).send("Not found")
        }));

        // Create new character
        this.router.post("/", [
            body("name").isString().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const character = await model("Character").create({
                name: request.body.name
            });
            return response.status(200).send(character);
        }));

        // Update character info
        this.router.patch("/:character_id", [
            body("name").isString().optional()
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const character = await model("Character").findById(request.params.character_id);
            if (!character) return response.status(404).send("Not found");

            this.updateIfDefined(character, "name", request.body.name);
            await character.save();

            return response.status(200).send(character);
        }));

        // (UNSAFE) Delete character
        this.router.delete("/:character_id", wrap(async (request, response, next) => {
            const character = await model("Character").findById(request.params.character_id);
            if (!character) return response.status(404).send("Not found");

            // todo: detach all buildings from specified character

            await character.delete();
            return response.status(200).send(true);
        }));

        // Get fraction of character
        this.router.get("/:character_id/fraction", wrap(async (request, response, next) => {
            const character = await model("Character").findById(request.params.character_id);
            if (!character) return response.status(404).send("Not found");

            return response.status(200).send(
                await character.fraction
            );
        }));

        // Attach character to fraction
        this.router.post("/:character_id/fraction", [
            body("fraction_id").isString().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const character = await model("Character").findById(request.params.character_id);
            if (!character) return response.status(404).send("Not found");

            const result = await character.attachToFraction(request.body.fraction_id);
            await character.save();

            return response.status(200).send(result);
        }));

        // Detach character from fraction
        this.router.delete("/:character_id/fraction", wrap(async (request, response, next) => {
            const character = await model("Character").findById(request.params.character_id);
            if (!character) return response.status(404).send("Not found");

            const result = await character.detachFromFraction(request.body.fraction_id);
            await character.save();

            return response.status(200).send(result);
        }));

        // Add perk to character
        this.router.post("/:character_id/perks", [
            body("perk_id").isString().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const character = await model("Character").findById(request.params.character_id);
            if (!character) return response.status(404).send("Not found");

            const result = character.addPerk(request.body.perk_id);
            await character.save();

            return response.status(200).send(result);
        }));

        // Remove perk from character
        this.router.delete("/:character_id/perks", [
            body("perk_id").isString().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const character = await model("Character").findById(request.params.character_id);
            if (!character) return response.status(404).send("Not found");

            const result = character.removePerk(request.body.perk_id);
            await character.save();

            return response.status(200).send(result);
        }));

        // Get personal buildings of character
        this.router.get("/:character_id/buildings", wrap(async (request, response, next) => {
            const character = await model("Character").findById(request.params.character_id);
            if (!character) return response.status(404).send("Not found");

            return response.status(200).send(
                await character.buildings.select("_id name")
            );
        }));

        // Get personal resources of character
        this.router.get("/:character_id/resources", wrap(async (request, response, next) => {
            const character = await model("Character").findById(request.params.character_id);
            if (!character) return response.status(404).send("Not found");

            const existingResources = await getRecordsMap("Resource", "_id");
            const characterResources = await character.resources;
            const resources = Object.keys(characterResources).map((id) => {
                return {
                    _id:    id,
                    amount: characterResources[id],
                    name:   existingResources[id].name
                }
            });

            return response.status(200).send(resources);
        }));
    }

}

module.exports = CharactersController;