// Database
const { model } = require("mongoose");
// Jobs
const { handleAllBuildings } = require("../jobs/Production");

module.exports = async () => {
    await handleAllBuildings(true);
};