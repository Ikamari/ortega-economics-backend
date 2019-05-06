// Admin controller factory
const AdminController = require("./AdminController");
// Models
const {
    Blueprint,
    Building,
    Facility,
    Fraction,
    Perk,
    Player,
    Resource,
    Trait
} = require("../../models");

module.exports.BlueprintController = (new AdminController).getRouter(Blueprint);
module.exports.BuildingController  = (new AdminController).getRouter(Building);
module.exports.FacilityController  = (new AdminController).getRouter(Facility);
module.exports.FractionController  = (new AdminController).getRouter(Fraction);
module.exports.PerkController      = (new AdminController).getRouter(Perk);
module.exports.PlayerController    = (new AdminController).getRouter(Player);
module.exports.ResourceController  = (new AdminController).getRouter(Resource);
module.exports.TraitController     = (new AdminController).getRouter(Trait);