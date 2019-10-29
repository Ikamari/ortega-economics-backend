// Database
const { model } = require("mongoose")
// Helpers
const { getRecordsMap } = require("../helpers/ModelsHelper");

module.exports = async () => {

    const facilitiesMap = await getRecordsMap("Facility");
    const facilityId = facilitiesMap["Репликатор"];

    // Create test data
    const timestamp = Date.now();

    const fraction = await model("Fraction").create({
        name: "test_fraction_" + timestamp
    });

    let firstBuilding = await model("Building").create({
        name: "test_building_1_" + timestamp,
        fraction_id: fraction._id,
        storage_size: 9999,
        energy_production: 0,
        is_active: true,
    });

    let secondBuilding = await model("Building").create({
        name: "test_building_2_" + timestamp,
        fraction_id: fraction._id,
        storage_size: 9999,
        energy_production: 150,
        is_active: true,
    });

    let thirdBuilding = await model("Building").create({
        name: "test_building_3_" + timestamp,
        fraction_id: fraction._id,
        storage_size: 9999,
        energy_production: 50,
        is_active: true,
    });

    try {
        await firstBuilding.addFacility(facilityId);
        await firstBuilding.addFacility(facilityId);
        await secondBuilding.addFacility(facilityId);

        // Energy calculation check
        let energyInfo = await fraction.energy;
        if (energyInfo.free !== 50) {
            throw new Error("Incorrect energy calculation, free energy in fraction is incorrect")
        }

        await firstBuilding.addFacility(facilityId);
        const disabledFacilityEntityId = await firstBuilding.addFacility(facilityId);

        // 4th facility must be disabled
        if (firstBuilding.facilities.id(disabledFacilityEntityId).is_active) {
            throw new Error("Incorrect energy calculation, 4th facility must be disabled")
        }

        // Building disable check, blackout shouldn't happen
        await thirdBuilding.disable();
        firstBuilding  = await model("Building").findById(firstBuilding._id);
        secondBuilding = await model("Building").findById(firstBuilding._id);
        if (!firstBuilding.is_active || !secondBuilding.is_active) {
            throw new Error("Incorrect energy calculation, unexpected blackout")
        }

        // Blackout check
        await secondBuilding.disable()
        firstBuilding = await model("Building").findById(firstBuilding._id);
        if (firstBuilding.is_active) {
            throw new Error("Incorrect energy calculation, expected blackout")
        }

        // Building enable check, building should return an error
        let hasError = false;
        try { await firstBuilding.enable(); }
        catch (e) { hasError = true }
        if (!hasError) throw new Error("Incorrect energy calculation, expected error");

        // Building enable check
        hasError = false;
        try {
            await secondBuilding.enable();
            await firstBuilding.enable();
        }
        catch (e) { hasError = true }
        if (!hasError) throw new Error("Incorrect energy calculation, unexpected error");
    } catch (e) {
        console.error(`Test failed: ${e.message} in ${e.fileName}:${e.lineNumber}`)
    }

    // Delete all test data
    await fraction.delete();
    await firstBuilding.delete();
    await secondBuilding.delete();
    await thirdBuilding.delete();
}