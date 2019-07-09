// Database
const { model }  = require("mongoose");
// Admin model controller factory
const ModelController = require("./ModelController");
// Controllers
const ProductionController =require("./ProductionController");

// Models controllers
module.exports.BlueprintEntityModelController = (new ModelController).getRouter(model("BlueprintEntity"));
module.exports.BlueprintModelController       = (new ModelController).getRouter(model("Blueprint"));
module.exports.RecipeModelController          = (new ModelController).getRouter(model("Recipe"));
module.exports.BuildingModelController        = (new ModelController).getRouter(model("Building"));
module.exports.FacilityTypeModelController    = (new ModelController).getRouter(model("FacilityType"));
module.exports.FractionModelController        = (new ModelController).getRouter(model("Fraction"));
module.exports.PerkModelController            = (new ModelController).getRouter(model("Perk"));
module.exports.CharacterModelController       = (new ModelController).getRouter(model("Character"));
module.exports.ResourceModelController        = (new ModelController).getRouter(model("Resource"));
module.exports.TraitModelController           = (new ModelController).getRouter(model("Trait"));

// Jobs controllers
module.exports.ProductionController = (new ProductionController()).getRouter()