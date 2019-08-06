// Database
const { model } = require("mongoose");
// Models
const { TYPE_IDS: facilityTypeIds } = require("../app/models/Facility");

const facilities = [
    {
        name: "Набор инструментов",
        type_id: null
    },
    {
        name: "Переносное лабораторное снар.",
        type_id: null
    },
    {
        name: "Переносной компьютер",
        type_id: null
    },
    {
        name: "Верстак",
        type_id: facilityTypeIds.Engineering
    },
    {
        name: "Механизированный верстак",
        type_id: facilityTypeIds.Engineering
    },
    {
        name: "Лабораторное рабочее место",
        type_id: facilityTypeIds.Laboratory
    },
    {
        name: "Компьютерное оборудование",
        type_id: null
    },
    {
        name: "Репликатор",
        type_id: facilityTypeIds.Engineering
    },
    {
        name: "Алхимический стол",
        type_id: null
    },
    {
        name: "Простое литейное оборудование",
        type_id: facilityTypeIds.Casting
    },
    {
        name: "Мастерская",
        type_id: facilityTypeIds.Engineering
    },
    {
        name: "Автоматизированная мастерская",
        type_id: facilityTypeIds.Engineering
    },
    {
        name: "Химико-биологическая лаборатория",
        type_id: facilityTypeIds.Laboratory
    },
    {
        name: "Мегапликатор",
        type_id: facilityTypeIds.Engineering
    },
    {
        name: "Кузница-мастерская",
        type_id: facilityTypeIds.Casting
    },
    {
        name: "Сложное литейное оборудование",
        type_id: facilityTypeIds.Casting
    }
];

/**
 * Make any changes you need to make to the database here
 */
async function up () {
    await facilities.map(async (facility) => {
        await model("Facility").create(facility);
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
