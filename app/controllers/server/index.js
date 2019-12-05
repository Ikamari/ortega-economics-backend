// Controllers
const TestController       = require("./TestController");
const FractionsController  = require("./FractionsController");
const TraitsController     = require("./TraitsController");
const CharactersController = require("./CharactersController");
const PerksController      = require("./PerksController");
const BuildingsController  = require("./BuildingsController");
const FacilitiesController = require("./FacilitiesController");
const RecipesController = require("./RecipesController");

module.exports.TestController       = (new TestController()).getRouter();
module.exports.FractionsController  = (new FractionsController()).getRouter();
module.exports.TraitsController     = (new TraitsController()).getRouter();
module.exports.CharactersController = (new CharactersController()).getRouter();
module.exports.PerksController      = (new PerksController()).getRouter();
module.exports.BuildingsController  = (new BuildingsController()).getRouter();
module.exports.FacilitiesController = (new FacilitiesController()).getRouter();
module.exports.RecipesController = (new RecipesController()).getRouter();