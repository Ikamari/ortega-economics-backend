// Controllers
const FractionsController = require("./FractionsController");
const BuildingsController = require("./BuildingsController");
const ResourcesController = require("./ResourcesController");

module.exports.FractionsController = (new FractionsController).getRouter();
module.exports.BuildingsController = (new BuildingsController).getRouter();
module.exports.ResourcesController = (new ResourcesController).getRouter();