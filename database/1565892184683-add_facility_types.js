// Database
const { model } = require("mongoose");

const facilityTypes = [
    {
        name: "Инженерное"
    },
    {
        name: "Лабораторное"
    },
    {
        name: "Универсальное",
        is_universal: true
    },
    {
        name: "Алхимическое"
    },
    {
        name: "Кузнечное"
    },
    {
        name: "Компьютерное"
    },
    {
        name: "Литейное"
    }
]

/**
 * Make any changes you need to make to the database here
 */
async function up () {
    return new Promise(async (resolve, reject) => {
        await facilityTypes.map(async (facilityType) => {
            try {
                await model("FacilityType").create(facilityType);
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

}

module.exports = { up, down };
