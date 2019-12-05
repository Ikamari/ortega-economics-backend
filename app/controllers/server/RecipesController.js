// Controller foundation
const ServerController = require("../ServerController");
const { wrap }         = require("../Controller");
// Database
const { model } = require("mongoose");

class RecipesController extends ServerController {

    createRoutes() {
        // Get all recipes
        this.router.get("/", wrap(async (request, response, next) => {
            return response.status(200).send(
                await model("Recipe").find({}).select("_id name")
            );
        }));

        // Get recipe info
        this.router.get("/:recipe_id", wrap(async (request, response, next) => {
            const recipe = await model("Recipe").findById(request.params.recipe_id);
            return recipe ?
                response.status(200).send(recipe) :
                response.status(404).send("Not found")
        }));

    }

}

module.exports = RecipesController;