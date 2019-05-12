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
app.use("/admin/blueprints", AdminControllers.BlueprintController);
app.use("/admin/buildings",  AdminControllers.BuildingController);
app.use("/admin/facilities", AdminControllers.FacilityController);
app.use("/admin/fractions",  AdminControllers.FractionController);
app.use("/admin/perks",      AdminControllers.PerkController);
app.use("/admin/players",    AdminControllers.PlayerController);
app.use("/admin/resources",  AdminControllers.ResourceController);
app.use("/admin/traits",     AdminControllers.TraitController);

// Models controllers
app.use("/fractions", ModelControllers.FractionsController);
app.use("/buildings", ModelControllers.BuildingsController);

// Exception handle middleware
app.use(function (error, request, response, next) {
    console.error(error.stack);
    response.status(500).send(error.message)
});

module.exports = app;