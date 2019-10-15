// Database
const { model } = require("mongoose")
// Jobs
const Craft = require("../jobs/Craft");
// Helpers
const { getRecordsMap } = require("../helpers/ModelsHelper");

const autotest = async () => {

    const resourcesMap = await getRecordsMap("Resource");
    const facilitiesMap = await getRecordsMap("Facility");
    const recipesMap = await getRecordsMap("Recipe");
    const blueprintsMap = await getRecordsMap("Blueprint");

    // Create test data
    const timestamp = Date.now();

    const fraction = await model("Fraction").create({
        name: "test_fraction_" + timestamp
    });

    const firstCharacter = await model("Character").create({
        name: "test_character_1_" + timestamp,
        fraction_id: fraction._id
    });

    const secondCharacter = await model("Character").create({
        name: "test_character_2_" + timestamp,
        fraction_id: fraction._id
    });

    const thirdCharacter = await model("Character").create({
        name: "test_character_3_" + timestamp
    });

    const firstBlueprintEntity = await model("BlueprintEntity").create({
        blueprint_id: blueprintsMap["Вирийский нож"]._id
    });

    const secondBlueprintEntity = await model("BlueprintEntity").create({
        blueprint_id: blueprintsMap["Кахалаш"]._id
    });

    let building = await model("Building").create({
        name: "test_building_" + timestamp,
        fraction_id: fraction._id,
        storage_size: 9999,
        is_active: true,
    });

    try {
        for(let i = 0; i < 3; i++) {
            await building.changeFacilityState(
                await building.addFacility(facilitiesMap["Набор инструментов"]._id, false, false),
                true
            );
        }
        for(let i = 0; i < 2; i++) {
            await building.changeFacilityState(
                await building.addFacility(facilitiesMap["Переносное лабораторное снаряжение"]._id, false, false),
                true
            );
        }
        await building.populate("facilities.properties").execPopulate();

        await building.editResources([
            { _id: resourcesMap["Сталь"]._id, amount: 2 },
            { _id: resourcesMap["Кожа"]._id, amount: 2 }
        ]);

        const craftProcessId = await Craft.startByBlueprint(firstCharacter, building, firstBlueprintEntity, [firstCharacter._id])

        // This part must throw an error about missing resources
        let hasError = false;
        try { await Craft.startByBlueprint(secondCharacter, building, firstBlueprintEntity, [secondCharacter._id]) }
        catch (e) { hasError = true }
        if (!hasError) throw new Error("No expected error");

        await building.editResources([
            { _id: resourcesMap["Сталь"]._id, amount: 2 },
            { _id: resourcesMap["Кожа"]._id, amount: 2 },
            { _id: resourcesMap["Травы"]._id, amount: 10 }
        ]);

        // Check of correct cancellation
        await Craft.cancel(firstCharacter, building, building.craft_processes.id(craftProcessId))
        if (!building.hasResources([
            { _id: resourcesMap["Сталь"]._id, amount: 4 },
            { _id: resourcesMap["Кожа"]._id, amount: 4 }
        ])) throw new Error("Incorrect amount of resources in building");
        await Craft.startByBlueprint(firstCharacter, building, firstBlueprintEntity, [firstCharacter._id])

        // This part must throw an error about busy participant
        const participants = await fraction.free_members;
        hasError = false;
        try { await Craft.startByBlueprint(firstCharacter, building, firstBlueprintEntity, [firstCharacter._id]) }
        catch (e) { hasError = true }
        if (!hasError) throw new Error("No expected error");

        // This part must throw an error about no permission
        hasError = false;
        try { await Craft.startByBlueprint(thirdCharacter, building, firstBlueprintEntity) }
        catch (e) { hasError = true }
        if (!hasError) throw new Error("No expected error");

        await Craft.startByRecipe(secondCharacter, building, recipesMap["Биомасса"], 1)

        await building.editResources([
            { _id: resourcesMap["Травы"]._id, amount: 19 }
        ]);

        // This part must throw an error about missing resources
        hasError = false;
        try { await Craft.startByRecipe(secondCharacter, building, recipesMap["Биомасса"], 2) }
        catch (e) { hasError = true }
        if (!hasError) throw new Error("No expected error");

        await Craft.startByRecipe(secondCharacter, building, recipesMap["Биомасса"], 1)
        await building.editResources([
            { _id: resourcesMap["Травы"]._id, amount: 1 }
        ]);

        // This part must throw an error about missing free facility
        hasError = false;
        try { await Craft.startByRecipe(secondCharacter, building, recipesMap["Биомасса"], 1) }
        catch (e) { hasError = true }
        if (!hasError) throw new Error("No expected error");
    } catch (e) {
        console.error(`Test failed: ${e.message} in ${e.fileName}:${e.lineNumber}`)
    }

    // Delete all test data
    await fraction.delete();
    await firstCharacter.delete();
    await secondCharacter.delete();
    await building.delete();
}

module.exports = autotest;