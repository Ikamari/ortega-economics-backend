// Database
const { model } = require("mongoose");
// Helpers
const { getRecordsMap } = require("../app/helpers/ModelsHelper");

// Quality levels
const
    BASIC_LEVEL   = 0.25,
    SOLID_LEVEL   = 0.55,
    COMPLEX_LEVEL = 0.95;

const facilities = [
    {
        name: "Набор инструментов",
        facility_type: "Инженерное",
        tech_tier: 1,
        quality_level: BASIC_LEVEL
    },
    {
        name: "Переносное лабораторное снар.",
        facility_type: "Лабораторное",
        tech_tier: 1,
        quality_level: BASIC_LEVEL
    },
    {
        name: "Переносной компьютер",
        facility_type: "Компьютерное",
        tech_tier: 0,
        quality_level: BASIC_LEVEL
    },
    {
        name: "Верстак",
        facility_type: "Инженерное",
        tech_tier: 2,
        quality_level: SOLID_LEVEL
    },
    {
        name: "Механизированный верстак",
        facility_type: "Инженерное",
        tech_tier: 3,
        quality_level: BASIC_LEVEL
    },
    {
        name: "Лабораторное рабочее место",
        facility_type: "Лабораторное",
        tech_tier: 2,
        quality_level: SOLID_LEVEL
    },
    {
        name: "Автоматизированное лабораторное рабочее место",
        facility_type: "Лабораторное",
        tech_tier: 3,
        quality_level: BASIC_LEVEL
    },
    {
        name: "Компьютерное оборудование",
        facility_type: "Компьютерное",
        tech_tier: 0,
        quality_level: SOLID_LEVEL
    },
    {
        name: "Репликатор",
        facility_type: "Универсальное",
        tech_tier: 2,
        quality_level: COMPLEX_LEVEL
    },
    {
        name: "Алхимический стол",
        facility_type: "Алхимическое",
        tech_tier: 3,
        quality_level: COMPLEX_LEVEL
    },
    {
        name: "Простое литейное оборудование",
        facility_type: "Литейное",
        tech_tier: 1,
        quality_level: 0
    },
    {
        name: "Мастерская",
        facility_type: "Инженерное",
        tech_tier: 2,
        quality_level: COMPLEX_LEVEL
    },
    {
        name: "Автоматизированная мастерская",
        facility_type: "Инженерное",
        tech_tier: 3,
        quality_level: SOLID_LEVEL
    },
    {
        name: "Химико-биологическая лаборатория",
        facility_type: "Лабораторное",
        tech_tier: 3,
        quality_level: SOLID_LEVEL
    },
    {
        name: "Мегапликатор",
        facility_type: "Универсальное",
        tech_tier: 3,
        quality_level: COMPLEX_LEVEL
    },
    {
        name: "Суперкомпьютер",
        facility_type: "Компьютерное",
        tech_tier: 0,
        quality_level: COMPLEX_LEVEL
    },
    {
        name: "Кузница-мастерская",
        facility_type: "Кузнечное",
        tech_tier: 3,
        quality_level: COMPLEX_LEVEL
    },
    {
        name: "Сложное литейное оборудование",
        facility_type: "Литейное",
        tech_tier: 2,
        quality_level: 0
    }
];

/**
 * Make any changes you need to make to the database here
 */
async function up () {
    const facilityTypesMap = await getRecordsMap("FacilityType");

    return new Promise(async (resolve, reject) => {
        await facilities.map(async (facility) => {
            try {
                // Check whether facility type is valid
                const facilityType = facilityTypesMap[facility.facility_type];
                if (!facilityType) throw new Error("Trying to use unknown facility type");

                await model("Facility").create({
                    name: facility.name,
                    quality_level: facility.quality_level,
                    tech_tier: facility.tech_tier,
                    type_id: facilityType._id
                });
            } catch (e) {
                reject(e);
            }
        })
        resolve(true);
    });
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
