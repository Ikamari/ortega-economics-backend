// Controllers
const FractionsController = require("./FractionsController");
const BuildingsController = require("./BuildingsController");

module.exports.FractionsController = (new FractionsController).getRouter();
module.exports.BuildingsController = (new BuildingsController).getRouter();