// Database
const { model } = require("mongoose")
// Helpers
const { getRecordsMap } = require("../helpers/ModelsHelper");

module.exports = async () => {

    const facilitiesMap = await getRecordsMap("Facility");

    // Create test data
    const timestamp = Date.now();

    const fraction = await model("Fraction").create({
        name: "test_fraction_" + timestamp
    });

    const firstBuilding = await model("Building").create({
        name: "test_building_1_" + timestamp,
        fraction_id: fraction._id,
        storage_size: 9999,
        energy_production: 100,
        is_active: true,
    });

    const secondBuilding = await model("Building").create({
        name: "test_building_2_" + timestamp,
        fraction_id: fraction._id,
        storage_size: 9999,
        energy_production: 200,
        is_active: true,
    });

    const energyInfo = await fraction.energy;

    try {

    } catch (e) {
        console.error(`Test failed: ${e.message} in ${e.fileName}:${e.lineNumber}`)
    }

    // Delete all test data
    await fraction.delete();
    await firstBuilding.delete();
    await secondBuilding.delete();
}