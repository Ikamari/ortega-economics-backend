// Database
const { model }  = require("mongoose");
// Admin controller factory
const AdminController = require("./AdminController");

module.exports.BlueprintController = (new AdminController).getRouter(model("Blueprint"));
module.exports.BuildingController  = (new AdminController).getRouter(model("Building"));
module.exports.FacilityController  = (new AdminController).getRouter(model("Facility"));
module.exports.FractionController  = (new AdminController).getRouter(model("Fraction"));
module.exports.PerkController      = (new AdminController).getRouter(model("Perk"));
module.exports.PlayerController    = (new AdminController).getRouter(model("Player"));
module.exports.ResourceController  = (new AdminController).getRouter(model("Resource"));
module.exports.TraitController     = (new AdminController).getRouter(model("Trait"));