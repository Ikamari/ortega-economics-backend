// Controller creator
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

module.exports.BlueprintController = AdminController(Blueprint);
module.exports.BuildingController  = AdminController(Building);
module.exports.FacilityController  = AdminController(Facility);
module.exports.FractionController  = AdminController(Fraction);
module.exports.PerkController      = AdminController(Perk);
module.exports.PlayerController    = AdminController(Player);
module.exports.ResourceController  = AdminController(Resource);
module.exports.TraitController     = AdminController(Trait);