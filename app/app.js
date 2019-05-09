// Server
const express    = require("express");
const bodyParser = require("body-parser");
// Admin Controllers
const {
    BlueprintController: BlueprintAdminController,
    BuildingController:  BuildingAdminController,
    FacilityController:  FacilityAdminController,
    FractionController:  FractionAdminController,
    PerkController:      PerkAdminController,
    PlayerController:    PlayerAdminController,
    ResourceController:  ResourceAdminController,
    TraitController:     TraitAdminController
} = require("./controllers/admin");
// Controllers
const {
    FractionsController,
    BuildingsController
} = require("./controllers/models");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Admin controllers
app.use("/admin/blueprints", BlueprintAdminController);
app.use("/admin/buildings",  BuildingAdminController);
app.use("/admin/facilities", FacilityAdminController);
app.use("/admin/fractions",  FractionAdminController);
app.use("/admin/perks",      PerkAdminController);
app.use("/admin/players",    PlayerAdminController);
app.use("/admin/resources",  ResourceAdminController);
app.use("/admin/traits",     TraitAdminController);

// Models controllers
app.use("/fractions", FractionsController);
app.use("/buildings", BuildingsController);

// Exception handle middleware
app.use(function (error, request, response, next) {
    console.error(error.stack);
    response.status(500).send(error.message)
});

module.exports = app;