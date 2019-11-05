// Server
const express    = require("express");
const bodyParser = require("body-parser");
// Controllers
// const AdminControllers = require("./controllers/admin");
// const ModelControllers = require("./controllers/models");
const ServerControllers = require("./controllers/server");
const ErrorResponse    = require("./controllers/ErrorResponse");

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// app.get("/", (request, response, next) => {
//     return response.status(200).send("I'm alive!")
// });

// Server
app.use("/server/test", ServerControllers.TestController);

// Admin
// app.use("/admin/jobs", AdminControllers.ProductionController);
// app.use("/admin/craft", AdminControllers.CraftController);

// Admin - Models
// app.use("/admin/blueprint-entities", AdminControllers.BlueprintEntityModelController);
// app.use("/admin/blueprints",         AdminControllers.BlueprintModelController);
// app.use("/admin/recipes",            AdminControllers.RecipeModelController);
// app.use("/admin/buildings",          AdminControllers.BuildingModelController);
// app.use("/admin/facilities",         AdminControllers.FacilityModelController);
// app.use("/admin/fractions",          AdminControllers.FractionModelController);
// app.use("/admin/perks",              AdminControllers.PerkModelController);
// app.use("/admin/characters",         AdminControllers.CharacterModelController);
// app.use("/admin/resources",          AdminControllers.ResourceModelController);
// app.use("/admin/traits",             AdminControllers.TraitModelController);

// Client - Models
// app.use("/fractions", ModelControllers.FractionsController);
// app.use("/buildings", ModelControllers.BuildingsController);
// app.use("/resources", ModelControllers.ResourcesController);

// Exception handle middleware
app.use(function (error, request, response, next) {
    if (error instanceof ErrorResponse) {
        return response.status(error.httpCode).send(error.response)
    }
    // todo: save logs to file
    console.error(error.stack);
    return response.status(500).send(process.env.NODE_ENV === "dev" ? error.message : "Internal server error")
});

module.exports = app;