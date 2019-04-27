// Controller creator
const AdminController = require("./AdminController");
// Models
const Resource = require("../../models/Resource");

module.exports.ResourceController = AdminController(Resource);