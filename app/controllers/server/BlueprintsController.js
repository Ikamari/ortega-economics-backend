// Controller foundation
const ServerController = require("../ServerController");
const { wrap } = require("../Controller");
const { body } = require('express-validator');
// Database
const { model } = require("mongoose");

class BlueprintsController extends ServerController {

	 createRoutes() {
        // Get all blueprints or entites
        this.router.get("/", [
        	body("entities").isBoolean().optional()
        	], wrap(async (request, response, next) => {
        		if (!this.validate(request, next)) return;
        		if(request.body.entities != true){ 
            	return response.status(200).send(
                await model("Blueprint").find({}).select("_id name")
            )} else response.status(200).send(
    			await model("BlueprintEntity").find({}).select("_id blueprint_id quality")
    		);
        }));

    	//Get blueprint info
    	this.router.get("/:blueprint_id", wrap(async (request,response,next) => {

    		const blueprint = await model("Blueprint").findById(request.params.blueprint_id);
    			return blueprint ?
    			response.status(200).send(blueprint) :
    			response.status(404).send("Not found.")
    	}));

    	//Create blueprint entity by ID
        this.router.post("/:blueprint_id/", [
            body("quality").isInt().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const blueprintentity = await model("BlueprintEntity").create({
                blueprint_id: request.params.blueprint_id,
                quality: request.body.quality
            });
            return response.status(200).send(blueprintentity);
        }));

        //Edit blueprint entity quality by ID
        this.router.patch("/:blueprint_id/:entity_id", [
            body("quality").isInt().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const blueprintentity = await model("BlueprintEntity").findById(request.params.entity_id);
            if(!blueprintentity) return response.status(404).send("No such entity")

            this.updateIfDefined(blueprintentity, "quality", request.body.quality);
        	await blueprintentity.save();

            return response.status(200).send(blueprintentity);
        }));

        //Delete blueprint entity
        this.router.delete("/:blueprint_id/:entity_id", wrap(async (request, response, next) => {
            const blueprintentity = await model("BlueprintEntity").findById(request.params.entity_id);
            if(!blueprintentity) return response.status(404).send("No such entity")

			await blueprintentity.delete();
			return response.status(200).send(true);
        }));

        //Get blueprint entity info
        this.router.get("/:blueprint_id/:entity_id", wrap(async (request, response, next) => {
            const blueprintentity = await model("BlueprintEntity").findById(request.params.entity_id);
            if(!blueprintentity) return response.status(404).send("No such entity")

			return response.status(200).send(blueprintentity);
        }));

}}

module.exports = BlueprintsController;