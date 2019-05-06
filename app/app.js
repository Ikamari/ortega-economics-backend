// Server
const express = require("express");
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
    FractionsController
} = require("./controllers/models");

const app = express();

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

module.exports = app;