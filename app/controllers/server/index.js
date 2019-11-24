// Controllers
const TestController       = require("./TestController");
const FractionsController  = require("./FractionsController");
const TraitsController     = require("./TraitsController");
const CharactersController = require("./CharactersController");
const PerksController      = require("./PerksController");

module.exports.TestController       = (new TestController()).getRouter();
module.exports.FractionsController  = (new FractionsController()).getRouter();
module.exports.TraitsController     = (new TraitsController()).getRouter();
module.exports.CharactersController = (new CharactersController()).getRouter();
module.exports.PerksController      = (new PerksController()).getRouter();