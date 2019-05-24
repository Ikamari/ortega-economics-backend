// Server
const express    = require("express");
const bodyParser = require("body-parser");
// Controllers
const AdminControllers = require("./controllers/admin");
const ModelControllers = require("./controllers/models");

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Admin controllers
app.use("/admin/jobs", AdminControllers.ProductionController)

// Admin model controllers
app.use("/admin/blueprints", AdminControllers.BlueprintModelController);
app.use("/admin/buildings",  AdminControllers.BuildingModelController);
app.use("/admin/facilities", AdminControllers.FacilityModelController);
app.use("/admin/fractions",  AdminControllers.FractionModelController);
app.use("/admin/perks",      AdminControllers.PerkModelController);
app.use("/admin/characters", AdminControllers.CharacterModelController);
app.use("/admin/resources",  AdminControllers.ResourceModelController);
app.use("/admin/traits",     AdminControllers.TraitModelController);

// Models controllers
app.use("/fractions", ModelControllers.FractionsController);
app.use("/buildings", ModelControllers.BuildingsController);
app.use("/resources", ModelControllers.ResourcesController);

// Exception handle middleware
app.use(function (error, request, response, next) {
    console.error(error.stack);
    response.status(500).send(error.message)
});

module.exports = app;