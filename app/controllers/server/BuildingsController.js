// Controller foundation
const ServerController = require("../ServerController");
const { wrap } = require("../Controller");
const { query, body } = require('express-validator');
// Database
const { model } = require("mongoose");

class BuildingsController extends ServerController {

    createRoutes() {

        // Get all buildings
        this.router.get("/", wrap(async (request, response, next) => {
            return response.status(200).send(
                await model("Building").find({}).select("_id name")
            );
        }));

        // Get building info
        this.router.get("/:building_id", wrap(async (request, response, next) => {
            const building = await model("Building").findById(request.params.building_id).select("-craft_processes");
            return building ?
                response.status(200).send(building) :
                response.status(404).send("Not found")
        }));

        // Create building
        this.router.post("/", [
            body("name").isString().exists({ checkFalsy: true }),
            body("available_workplaces").isInt({ min: 0 }).optional(),
            body("storage_size").isInt({ min: 0 }).optional(),
            body("energy_production").isInt({ min: 0 }).optional(),
            body("production_priority").isInt().optional(),
            body("storage_priority").isInt().optional(),
            body("defense_level").isInt({ min: 0 }).optional(),
            body("money_production").isInt().optional(), 
            body("money").isInt({ min: 0 }).optional(),
            body("workers_count").isInt({ min: 0 }).optional(),
            body("phantom_workers_count").isInt({ min: 0 }).optional(),
            body("food_consumption").isInt({ min: 0 }).optional(),
            body("water_consumption").isInt({ min: 0 }).optional(),
            body("money_consumption").isInt({ min: 0 }).optional()
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;
            
            const building = await model("Building").create({
                name:                        request.body.name,
                available_workplaces:        request.body.available_workplaces,
                used_workplaces:             request.body.workers_count,
                used_workplaces_by_phantoms: request.body.phantom_workers_count,
                storage_size:                request.body.storage_size,
                energy_production:           request.body.energy_production,
                production_priority:         request.body.production_priority,
                storage_priority:            request.body.storage_priority,
                defense_level:               request.body.defense_level,
                money_production:            request.body.money_production,
                money:                       request.body.money,
                food_consumption:            request.body.food_consumption,
                water_consumption:           request.body.water_consumption,
                money_consumption:           request.body.money_consumption
            });
            return response.status(200).send(building);
        }));

        // Update building
        this.router.patch("/:building_id", [
            body("name").isString().optional(),
            body("available_workplaces").isInt({ min: 0 }).optional(),
            body("storage_size").isInt({ min: 0 }).optional(),
            body("energy_production").isInt({ min: 0 }).optional(),
            body("production_priority").isInt().optional(),
            body("storage_priority").isInt().optional(),
            body("defense_level").isInt({ min: 0 }).optional(),
            body("money_production").isInt().optional(),
            body("money").isInt({ min: 0 }).optional(),
            body("workers_count").isInt({ min: 0 }).optional(),
            body("phantom_workers_count").isInt({ min: 0 }).optional(),
            body("food_consumption").isInt({ min: 0 }).optional(),
            body("water_consumption").isInt({ min: 0 }).optional(),
            body("money_consumption").isInt({ min: 0 }).optional()
        ],  wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            this.updateIfDefined(building, "name", request.body.name);
            this.updateIfDefined(building, "available_workplaces", request.body.available_workplaces);
            this.updateIfDefined(building, "storage_size", request.body.storage_size, (newStorageSize) => {
                // Check whether new storage size is valid
                // todo: check should be changed once the used storage calculation will be redone
                if (newStorageSize < building.used_storage) {
                    throw new Error("New storage size cannot be less than currently used storage space");
                }
            });
            this.updateIfDefined(building, "energy_production", request.body.energy_production);
            this.updateIfDefined(building, "production_priority", request.body.production_priority);
            this.updateIfDefined(building, "storage_priority", request.body.storage_priority);
            this.updateIfDefined(building, "defense_level", request.body.defense_level);
            this.updateIfDefined(building, "money_production", request.body.money_production);
            this.updateIfDefined(building, "money", request.body.money);
            this.updateIfDefined(building, "used_workplaces", request.body.workers_count);
            this.updateIfDefined(building, "used_workplaces_by_phantoms", request.body.phantom_workers_count);
            this.updateIfDefined(building, "food_consumption", request.body.food_consumption);
            this.updateIfDefined(building, "water_consumption", request.body.water_consumption);
            this.updateIfDefined(building, "money_consumption", request.body.money_consumption);

            await building.save();
            return response.status(200).send(building);
        }));

        // Delete building
        this.router.delete("/:building_id", wrap(async (request, response, next) => {
            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.detachFromOwner();

            await building.delete();
            return response.status(200).send(true);
        }));

        // Check whether character has access to building
        this.router.get("/:building_id/has-access", [
            query("character_id").isString().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            const character = await model("Character").findById(request.query.character_id);
            if (!character) response.status(400).send("Character not found");

            return response.status(200).send(building.characterHasAccess(character, false));
        }));

        // Attach building to the fraction
        this.router.post("/:building_id/fraction", [
            body("fraction_id").isString().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.attachToFraction(request.body.fraction_id);

            await building.save();
            return response.status(200).send(true);
        }));

        // Attach building to the character
        this.router.post("/:building_id/character", [
            body("character_id").isString().exists({ checkFalsy: true })
        ],  wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.attachToCharacter(request.body.character_id);

            await building.save();
            return response.status(200).send(true);
        }));

        // Detach building from character/fraction
        this.router.delete("/:building_id/owner", wrap(async (request, response, next) => {
            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.detachFromOwner();

            await building.save();
            return response.status(200).send(true);
        }));

        // Add resources production to the building
        this.router.post("/:building_id/production", [
            body("resource_id").isString().exists({ checkFalsy: true }),
            body("amount").isInt({ min: 0 }).exists({ checkFalsy: true }),
            body("chance").isFloat({ min: 0, max: 1 }).exists({ checkFalsy: true }),
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.addProduction(
                request.body.resource_id,
                request.body.amount,
                request.body.chance
            );
            return response.status(200).send(true);
        }));

        // Remove resources production from the building
        this.router.delete("/:building_id/production/:production_id", wrap(async (request, response, next) => {
            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.removeProduction(request.params.production_id);
            return response.status(200).send(true);
        }));

        // Add resources consumption to the building
        this.router.post("/:building_id/consumption", [
            body("resource_id").isString().exists({ checkFalsy: true }),
            body("amount").isInt({ min: 0 }).exists({ checkFalsy: true }),
            body("chance").isFloat({ min: 0, max: 1 }).exists({ checkFalsy: true }),
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.addConsumption(
                request.body.resource_id,
                request.body.amount,
                request.body.chance
            );
            return response.status(200).send(true);
        }));

        // Remove resources consumption from the building
        this.router.delete("/:building_id/consumption/:consumption_id", wrap(async (request, response, next) => {
            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.removeConsumption(request.params.consumption_id);
            return response.status(200).send(true);
        }));

        // Get building's current resources
        this.router.get("/:building_id/resources", wrap (async (request, response, next) => {
            const building = await model("Building").findById(request.params.building_id).select("resources");
            if (!building) return response.status(404).send("Not found");
            
            let resourceIterator = building.resources.keys();
            let i = 0;

            building.resources.forEach(async(item) => {
                const resource = await model("Resource").findById(resourceIterator.next().value);
                await building.resources.set(resource.name, item);
                await building.resources.delete(resource._id.toString());
                i++;
                if(i == building.resources.size) return response.status(200).send(building)
            });       
        }));


        // Increase/decrease amount of resources in building
        this.router.patch("/:building_id/resources", [
            body("resources", "Invalid array of objects")
                .isArray()
                .exists({ checkFalsy: true })
                .custom((resources) => {
                    return resources.every((resource) => {
                        return (typeof resource === "object") && (resource.hasOwnProperty("_id") && resource.hasOwnProperty("amount"));
                    });
                })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.editResources(
                request.body.resources,
                request.query.strict ? request.query.strict === "true" : true
            );
            return response.status(200).send(true);
        }));

        // Increase/decrease amount of specific resource in building
        this.router.patch("/:building_id/resource", [
            body("resource_id").isString().exists({ checkFalsy: true }),
            body("amount").isInt().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.editResource({
                _id:    request.body.resource_id,
                amount: request.body.amount
            }, request.query.strict ? request.query.strict === "true" : true);
            return response.status(200).send(true);
        }));

        // Enable building
        this.router.post("/:building_id/enable", wrap(async (request, response, next) => {
            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.enable();
            return response.status(200).send(true);
        }));

        // Disable building
        this.router.post("/:building_id/disable", wrap(async (request, response, next) => {
            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.disable();
            return response.status(200).send(true);
        }));

        // Add facility to the building
        this.router.post("/:building_id/facilities", [
            body("facility_id").isString().exists({ checkFalsy: true })
        ], wrap(async (request, response, next) => {
            if (!this.validate(request, next)) return;

            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.addFacility(request.body.facility_id);
            return response.status(200).send(true);
        }));

        // Remove facility from the building
        this.router.delete("/:building_id/facilities/:facility_entity_id", wrap(async (request, response, next) => {
            const building = await model("Building").findById(request.params.building_id);
            if (!building) return response.status(404).send("Not found");

            await building.removeFacility(request.params.facility_entity_id);
            return response.status(200).send(true);
        }));

    }

}

module.exports = BuildingsController;