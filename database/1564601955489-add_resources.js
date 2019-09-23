// Database
const { model } = require("mongoose");

const resources = [
    {
        name: "Пища",
        min_price: 10,
        max_price: 30
    },
    {
        name: "Вода",
        min_price: 10,
        max_price: 30
    },
    {
        name: "Травы",
        min_price: 5,
        max_price: 15
    },
    {
        name: "Древесина",
        min_price: 15,
        max_price: 45
    },
    {
        name: "Кожа",
        min_price: 20,
        max_price: 40
    },
    {
        name: "Ткань",
        min_price: 5,
        max_price: 25
    },
    {
        name: "Строительный камень",
        min_price: 5,
        max_price: 15
    },
    {
        name: "Известняк и глина",
        min_price: 5,
        max_price: 15
    },
    {
        name: "Руда"
    },
    {
        name: "Минералы",
        min_price: 25,
        max_price: 45
    },
    {
        name: "Уголь",
        min_price: 1,
        max_price: 10
    },
    {
        name: "Красный камень",
        min_price: 35,
        max_price: 55
    },
    {
        name: "Кристаллы псиолита",
        min_price: 50,
        max_price: 150
    },
    {
        name: "Каронис",
        min_price: 100,
        max_price: 300
    },
    {
        name: "Ниберийская ртуть",
        min_price: 100,
        max_price: 300
    },
    {
        name: "Триоксид диводорода",
        min_price: 100,
        max_price: 300
    },
    {
        name: "Биомасса"
    },
    {
        name: "Пластиковое вторсырье"
    },
    {
        name: "Корошка",
        min_price: 10,
        max_price: 30
    },
    {
        name: "Аромалиск",
        min_price: 10,
        max_price: 30
    },
    {
        name: "Регас",
        min_price: 10,
        max_price: 30
    },
    {
        name: "Фроша",
        min_price: 10,
        max_price: 30
    },
    {
        name: "Малийка",
        min_price: 10,
        max_price: 30
    },
    {
        name: "Химикаты",
        min_price: 40,
        max_price: 60
    },
    {
        name: "Шкарки",
        min_price: 25,
        max_price: 45
    },
    {
        name: "Электронные компоненты",
        min_price: 25,
        max_price: 85
    },
    {
        name: "Пластик",
        min_price: 25,
        max_price: 45
    },
    {
        name: "Строительные материалы",
        min_price: 20,
        max_price: 50
    },
    {
        name: "Энергоячейка",
        min_price: 50,
        max_price: 150
    },
    {
        name: "Сталь",
        min_price: 50,
        max_price: 100
    },
    {
        name: "Тектит",
        min_price: 75,
        max_price: 125
    },
    {
        name: "Ионид",
        min_price: 150,
        max_price: 450
    },
    {
        name: "Тизид",
        min_price: 150,
        max_price: 450
    },
    {
        name: "Люмит",
        min_price: 150,
        max_price: 450
    },
    {
        name: "Дифазит",
        min_price: 350,
        max_price: 650
    },
    {
        name: "Гравитон",
        min_price: 750,
        max_price: 1250
    },
    {
        name: "Пласталь",
        min_price: 100,
        max_price: 200
    },
    {
        name: "Бронелит",
        min_price: 100,
        max_price: 200
    },
    {
        name: "Псиолит-бета",
        min_price: 20,
        max_price: 50
    },
    // {
    //     name: "Раб"
    // },
    // {
    //     name: "Рабочий",
    //     min_price: 35,
    //     max_price: 100
    // },
    // {
    //     name: "Рекрут",
    //     min_price: 50,
    //     max_price: 150
    // },
    // {
    //     name: "Солдат"
    // },
    {
        name: "Драгоценная древесина",
        min_price: 100,
        max_price: 500
    },
    {
        name: "Драгоценный камень",
        min_price: 500,
        max_price: 1000
    },
    {
        name: "Золото",
        min_price: 200,
        max_price: 600
    },
    {
        name: "Серебро",
        min_price: 100,
        max_price: 300
    },
    // {
    //     name: "Деньги",
    //     min_price: 1,
    //     max_price: 1
    // },
    // {
    //     name: "Электроэнергия",
    //     min_price: 10,
    //     max_price: 30
    // },
    {
        name: "Метеоритное железо"
    },
    {
        name: "Сканирование мозга опытного фехтовальщика"
    },
    {
        name: "Черная сущность"
    },
    {
        name: "Биоинструкция"
    },
    {
        name: "Сацеллово корневище"
    },
    {
        name: "Разумный глаз"
    },
    {
        name: "Солнце гнева"
    },
    {
        name: "Кристалл прозрения"
    },
    {
        name: "Нанитный переключатель"
    },
    {
        name: "Живой металл"
    },
    {
        name: "Живая плоть"
    },
    {
        name: "Пепельная плоть"
    }
]

/**
 * Make any changes you need to make to the database here
 */
async function up () {
    return new Promise(async (resolve, reject) => {
        await resources.map(async (resource) => {
            try {
                await model("Resource").create(resource);
            } catch (e) {
                reject(e);
            }
        })
        resolve(true)
    });
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {

}

module.exports = { up, down };
