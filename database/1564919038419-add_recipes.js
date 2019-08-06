// Database
const { model } = require("mongoose");
// Models
const { TYPE_IDS: facilityTypeIds } = require("../app/models/Facility");
const { getResourcesMap } = require("../app/models/Resource");

const recipes = [
    {
        name: "Биомасса",
        required_resources: [
            { name: "Травы", amount: 10 }
        ],
        required_facility_type_id: facilityTypeIds.Laboratory,
        amount: 1,
        craft_time: 60
    },
    {
        name: "Биомасса",
        required_resources: [
            { name: "Пища", amount: 10 }
        ],
        required_facility_type_id: facilityTypeIds.Laboratory,
        amount: 1,
        craft_time: 60
    },
    {
        name: "Уголь",
        required_resources: [
            { name: "Древесина", amount: 1 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 5,
        craft_time: 60
    },
    {
        name: "Химикаты",
        required_resources: [
            { name: "Минералы", amount: 1 }
        ],
        required_facility_type_id: facilityTypeIds.Laboratory,
        amount: 1,
        craft_time: 60
    },
    {
        name: "Электронные компоненты",
        required_resources: [
            { name: "Красный камень", amount: 1 }
        ],
        required_facility_type_id: facilityTypeIds.Engineering,
        amount: 5,
        craft_time: 720
    },
    {
        name: "Псиолит-бета",
        required_resources: [
            { name: "Кристаллы псиолита", amount: 1 }
        ],
        required_facility_type_id: facilityTypeIds.Laboratory,
        amount: 5,
        craft_time: 300
    },
    {
        name: "Пластик",
        required_resources: [
            { name: "Пластиковое вторсырье", amount: 2 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 5,
        craft_time: 60
    },
    {
        name: "Энергоячейки",
        required_resources: [
            { name: "Электронные компоненты", amount: 2 }
        ],
        required_facility_type_id: facilityTypeIds.Engineering,
        amount: 1,
        craft_time: 60
    },
    {
        name: "Шкарки",
        required_resources: [
            { name: "Руда", amount: 2 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 10,
        craft_time: 60
    },

    {
        name: "Тектит",
        required_resources: [
            { name: "Пластик", amount: 1 },
            { name: "Ткань", amount: 1 }
        ],
        required_facility_type_id: facilityTypeIds.Laboratory,
        amount: 1,
        craft_time: 60
    },
    {
        name: "Дифазит",
        required_resources: [
            { name: "Каронис", amount: 2 },
            { name: "Триоксид диводорода", amount: 2 }
        ],
        required_facility_type_id: facilityTypeIds.Laboratory,
        amount: 24,
        craft_time: 1440
    },
    {
        name: "Тизид",
        required_resources: [
            { name: "Ниберийская ртуть", amount: 1 },
            { name: "Шкарки", amount: 2 },
            { name: "Тизид", amount: 1 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 1,
        craft_time: 300
    },
    {
        name: "Люмит",
        required_resources: [
            { name: "Ниберийская ртуть", amount: 1 },
            { name: "Шкарки", amount: 2 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 1,
        craft_time: 300
    },
    {
        name: "Бронелит",
        required_resources: [
            { name: "Шкарки", amount: 3 },
            { name: "Тектит", amount: 1 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 1,
        craft_time: 420
    },
    {
        name: "Пласталь",
        required_resources: [
            { name: "Сталь", amount: 1 },
            { name: "Пластик", amount: 3 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 1,
        craft_time: 420
    },
    {
        name: "Ионид",
        required_resources: [
            { name: "Триоксид диводорода", amount: 1 },
            { name: "Шкарки", amount: 2 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 1,
        craft_time: 300
    },
    {
        name: "Сталь",
        required_resources: [
            { name: "Шкарки", amount: 1 },
            { name: "Уголь", amount: 1 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 5,
        craft_time: 60
    },
    {
        name: "Строительные материалы",
        required_resources: [
            { name: "Известняк и глина", amount: 1 },
            { name: "Вода", amount: 1 }
        ],
        required_facility_type_id: facilityTypeIds.Casting,
        amount: 1,
        craft_time: 60
    },
]

/**
 * Make any changes you need to make to the database here
 */
async function up () {
    const resourcesMap = await getResourcesMap();
    await recipes.map(async (recipe) => {
        const requiredResources = [];

        // Check whether required resources are valid
        recipe.required_resources.map((requiredResource) => {
            const requiredResourceId = resourcesMap[requiredResource.name]
            if (!requiredResource) throw new Error("Trying to use unknown resource type");
            requiredResources.push({ _id: requiredResourceId, amount: requiredResource.amount })
        });

        // Check whether recipe result is valid
        const resultId = resourcesMap[recipe.name];
        if (!resultId) throw new Error("Trying to use unknown resource type");

        await model("Recipe").create({
            name: recipe.name,
            resource_id: resultId,
            required_resources: requiredResources,
            required_facility_type_id: recipe.required_facility_type_id,
            amount: recipe.amount,
            craft_time: recipe.craft_time
        });
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
}

module.exports = { up, down };
