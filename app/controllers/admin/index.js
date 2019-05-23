// Database
const { model }  = require("mongoose");
// Admin model controller factory
const ModelController = require("./ModelController");
// Controllers
const JobsController =require("./JobsController");

module.exports.BlueprintModelController = (new ModelController).getRouter(model("Blueprint"));
module.exports.BlueprintModelController = (new ModelController).getRouter(model("Recipe"));
module.exports.BuildingModelController  = (new ModelController).getRouter(model("Building"));
module.exports.FacilityModelController  = (new ModelController).getRouter(model("Facility"));
module.exports.FractionModelController  = (new ModelController).getRouter(model("Fraction"));
module.exports.PerkModelController      = (new ModelController).getRouter(model("Perk"));
module.exports.PlayerModelController    = (new ModelController).getRouter(model("Player"));
module.exports.ResourceModelController  = (new ModelController).getRouter(model("Resource"));
module.exports.TraitModelController     = (new ModelController).getRouter(model("Trait"));

module.exports.JobsController = (new JobsController()).getRouter()