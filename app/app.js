// Server
const express = require("express");
// Admin Controllers
const {
    ResourceController: ResourceAdminController,
} = require("./controllers/admin/index");

const app = express();
// Admin controllers
app.use("/admin/resources", ResourceAdminController);

module.exports = app;