// Controllers
const TestController      = require("./TestController");
const FractionsController = require("./FractionsController");
const TraitsController    = require("./TraitsController");

module.exports.TestController      = (new TestController()).getRouter();
module.exports.FractionsController = (new FractionsController()).getRouter();
module.exports.TraitsController    = (new TraitsController()).getRouter();