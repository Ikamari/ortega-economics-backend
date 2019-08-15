// Database
const {model} = require("mongoose");
// Helpers
const { getRecordsMap } = require("../app/helpers/ModelsHelper");

const recipes = [
    {
        name: "Биомасса",
        recipe_name: "Биомасса",
        required_resources: [
            {name: "Травы", amount: 10}
        ],
        amount: 1,
        craft_time: 3600,
        required_facility_type: "Лабораторное",
        tech_tier: 1
    },
    {
        name: "Биомасса",
        recipe_name: "Биомасса",
        required_resources: [
            {name: "Пища", amount: 10}
        ],
        amount: 1,
        craft_time: 3600,
        required_facility_type: "Лабораторное",
        tech_tier: 1
    },
    {
        name: "Уголь",
        recipe_name: "Уголь",
        required_resources: [
            {name: "Древесина", amount: 1}
        ],
        amount: 1,
        craft_time: 720,
        required_facility_type: "Литейное",
        tech_tier: 1
    },
    {
        name: "Химикаты",
        recipe_name: "Химикаты",
        required_resources: [
            {name: "Минералы", amount: 1}
        ],
        amount: 1,
        craft_time: 3600,
        required_facility_type: "Лабораторное",
        tech_tier: 2
    },
    {
        name: "Электронные компоненты",
        recipe_name: "Электронные компоненты",
        required_resources: [
            {name: "Красный камень", amount: 1}
        ],
        amount: 5,
        craft_time: 21600,
        required_facility_type: "Инженерное",
        tech_tier: 2
    },
    {
        name: "Псиолит-бета",
        recipe_name: "Псиолит-бета",
        required_resources: [
            {name: "Кристаллы псиолита", amount: 1}
        ],
        amount: 5,
        craft_time: 21600,
        required_facility_type: "Лабораторное",
        tech_tier: 2
    },
    {
        name: "Пластик",
        recipe_name: "Пластик",
        required_resources: [
            {name: "Пластиковое вторсырье", amount: 2}
        ],
        amount: 2,
        craft_time: 720,
        required_facility_type: "Литейное",
        tech_tier: 1
    },
    {
        name: "Энергоячейка",
        recipe_name: "Энергоячейки",
        required_resources: [
            {name: "Электронные компоненты", amount: 2}
        ],
        amount: 2,
        craft_time: 3600,
        required_facility_type: "Инженерное",
        tech_tier: 2
    },
    {
        name: "Шкарки",
        recipe_name: "Шкарки",
        required_resources: [
            {name: "Руда", amount: 2}
        ],
        amount: 1,
        craft_time: 360,
        required_facility_type: "Литейное",
        tech_tier: 1
    },
    {
        name: "Тектит",
        recipe_name: "Тектит",
        required_resources: [
            {name: "Пластик", amount: 1},
            {name: "Ткань", amount: 1}
        ],
        amount: 1,
        craft_time: 3600,
        required_facility_type: "Лабораторное",
        tech_tier: 2
    },
    {
        name: "Дифазит",
        recipe_name: "Дифазит",
        required_resources: [
            {name: "Каронис", amount: 2},
            {name: "Триоксид диводорода", amount: 2}
        ],
        amount: 1,
        craft_time: 86400,
        required_facility_type: "Лабораторное",
        tech_tier: 3
    },
    {
        name: "Тизид",
        recipe_name: "Тизид",
        required_resources: [
            {name: "Ниберийская ртуть", amount: 1},
            {name: "Шкарки", amount: 2},
            {name: "Тизид", amount: 1}
        ],
        amount: 1,
        craft_time: 21600,
        required_facility_type: "Литейное",
        tech_tier: 2
    },
    {
        name: "Люмит",
        recipe_name: "Люмит",
        required_resources: [
            {name: "Ниберийская ртуть", amount: 1},
            {name: "Шкарки", amount: 2}
        ],
        amount: 1,
        craft_time: 21600,
        required_facility_type: "Литейное",
        tech_tier: 2
    },
    {
        name: "Бронелит",
        recipe_name: "Бронелит",
        required_resources: [
            {name: "Шкарки", amount: 3},
            {name: "Тектит", amount: 1}
        ],
        amount: 1,
        craft_time: 36000,
        required_facility_type: "Литейное",
        tech_tier: 2
    },
    {
        name: "Пласталь",
        recipe_name: "Пласталь",
        required_resources: [
            {name: "Сталь", amount: 1},
            {name: "Пластик", amount: 3}
        ],
        amount: 1,
        craft_time: 36000,
        required_facility_type: "Литейное",
        tech_tier: 2
    },
    {
        name: "Ионид",
        recipe_name: "Ионид",
        required_resources: [
            {name: "Триоксид диводорода", amount: 1},
            {name: "Шкарки", amount: 2}
        ],
        amount: 1,
        craft_time: 21600,
        required_facility_type: "Литейное",
        tech_tier: 2
    },
    {
        name: "Сталь",
        recipe_name: "Сталь",
        required_resources: [
            {name: "Шкарки", amount: 1},
            {name: "Уголь", amount: 1}
        ],
        amount: 1,
        craft_time: 720,
        required_facility_type: "Литейное",
        tech_tier: 2
    },
    {
        name: "Строительные материалы",
        recipe_name: "Строительные материалы",
        required_resources: [
            {name: "Известняк и глина", amount: 1},
            {name: "Вода", amount: 1}
        ],
        amount: 1,
        craft_time: 720,
        required_facility_type: "Литейное",
        tech_tier: 1
    }
];

/**
 * Make any changes you need to make to the database here
 */
async function up () {
    const resourcesMap = await getRecordsMap("Resource");
    const facilityTypesMap = await getRecordsMap("FacilityType");

    await recipes.map(async (recipe) => {
        const requiredResources = [];

        // Check whether required resources are valid
        recipe.required_resources.map((requiredResource) => {
            const requiredResourceId = resourcesMap[requiredResource.name]
            if (!requiredResource) throw new Error("Trying to use unknown resource");
            requiredResources.push({ _id: requiredResourceId, amount: requiredResource.amount })
        });

        // Check whether recipe result is valid
        const resultId = resourcesMap[recipe.name];
        if (!resultId) throw new Error("Trying to use unknown resource");

        // Check whether facility type is valid
        const facilityTypeId = facilityTypesMap[recipe.required_facility_type];
        if (!facilityTypeId) throw new Error("Trying to use unknown facility type");
        
        await model("Recipe").create({
            name: recipe.recipe_name,
            resource_id: resultId,
            required_resources: requiredResources,
            required_facility_type_id: facilityTypeId,
            amount: recipe.amount,
            craft_time: recipe.craft_time / 60
        });
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
