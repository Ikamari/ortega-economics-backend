// Database
const {model} = require("mongoose");
// Helpers
const { getRecordsMap } = require("../app/helpers/ModelsHelper");
const { capitalizeFirstLetter } = require("../app/helpers/StringHelper")

const blueprints = [
    {
        name: "Вирийский нож",
        difficulty: 3,
        required_resources: "2 Сталь, 1 Кожа",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Кахалаш",
        difficulty: 4,
        required_resources: "3 Сталь, 1 Кожа",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 2
    },
    {
        name: "“Миротворец”",
        difficulty: 3,
        required_resources: "1 Сталь, 1 Тектит, 1 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Переговорщик",
        difficulty: 5,
        required_resources: "1 Сталь, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Телесветы",
        difficulty: 5,
        required_resources: "1 Сталь, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Шукна",
        difficulty: 3,
        required_resources: "3 шкарки, 1 Кожа",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 1
    },
    {
        name: "Фикха",
        difficulty: 3,
        required_resources: "2 шкарки, 1 Кожа",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 1
    },
    {
        name: "Жало",
        difficulty: 8,
        required_resources: "1 Сталь, 1 пласталь, 2 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Фазовый нож",
        difficulty: 10,
        required_resources: "2 дифазит, 2 пласталь,",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Крис",
        difficulty: 6,
        required_resources: "5 Шкарки, 2 Кожа",
        required_facility_types: [
            "Кузнечное"
        ],
        tech_tier: 2
    },
    {
        name: "Мономолекулярный нож",
        difficulty: 10,
        required_resources: "1 ионид, 2 Пласталь, 2 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "“Гармонизатор”",
        difficulty: 8,
        required_resources: "2 Энергоячейка, 3 Ионид, 1 пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Рогосвет",
        difficulty: 5,
        required_resources: "1 Сталь, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Энергокнут",
        difficulty: 6,
        required_resources: "1 Энергоячейка, 1 пласталь, 1 ионид, 2 Кожа",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Гуркхское копье",
        difficulty: 3,
        required_resources: "2 Древесина, 1 Шкарки",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 1
    },
    {
        name: "Шкармеч",
        difficulty: 3,
        required_resources: "3 шкарки, 1 Кожа",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 1
    },
    {
        name: "Черный тесак",
        difficulty: 4,
        required_resources: "3 Сталь, 1 Кожа",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 2
    },
    {
        name: "Галльский меч",
        difficulty: 6,
        required_resources: "4 Сталь, 1 Кожа",
        required_facility_types: [
            "Кузнечное"
        ],
        tech_tier: 2
    },
    {
        name: "Виброклинок",
        difficulty: 6,
        required_resources: "3 Сталь, 1 Электронные компоненты, 1 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Энерготопор",
        difficulty: 7,
        required_resources: "2 Сталь, 2 Энергоячейка, 2 Электронные компоненты, 1 ионид",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Шоковая дубина",
        difficulty: 6,
        required_resources: "1 Сталь, 1 Тектит, 1 Пластик, 1 Энергоячейка, 1 Электронные компоненты, 1 ионид",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Лазерный резак",
        difficulty: 6,
        required_resources: "2 Каронис, 3 Пласталь, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Железный мастер",
        difficulty: 8,
        required_resources: "3 Сталь, 1 Кожа",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 2
    },
    {
        name: "Термоклинок",
        difficulty: 6,
        required_resources: "3 Энергоячейка, 1 Электронные компоненты, 2 Пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Промышленная горелка",
        difficulty: 4,
        required_resources: "2 Сталь, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Килаха",
        difficulty: 9,
        required_resources: "3 Сталь, 1 Кожа",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 2
    },
    {
        name: "Гнев дракона",
        difficulty: 7,
        required_resources: "3 Химикаты, 3 пласталь, 1 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Топор",
        difficulty: 4,
        required_resources: "1 Древесина, 2 шкарки",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 1
    },
    {
        name: "Энергоглефа",
        difficulty: 7,
        required_resources: "3 Сталь, 2 Пласталь, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Позитронный угнетатель",
        difficulty: 6,
        required_resources: "3 Ионид, 1 Тектит, 2 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Дикарский меч",
        difficulty: 4,
        required_resources: "5 Шкарки, 1 Кожа",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 1
    },
    {
        name: "Бур",
        difficulty: 7,
        required_resources: "2 Энергоячейка, 1 пласталь, 2 Пластик, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Карда",
        difficulty: 5,
        required_resources: "2 шкарки, 2 Сталь, 2 Кожа",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 2
    },
    {
        name: "Магнитный цеп",
        difficulty: 6,
        required_resources: "3 Энергоячейка, 3 Электронные компоненты, 2 Пласталь, 1 Каронис",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Пневмокулак",
        difficulty: 5,
        required_resources: "2 Энергоячейка, 1 Электронные компоненты, 2 Пластик, 2 Сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Мусорный топор",
        difficulty: 5,
        required_resources: "5 шкарки",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 1
    },
    {
        name: "Священный разделитель",
        difficulty: 6,
        required_resources: "2 Энергоячейка, 1 пласталь, 2 Пластик, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Дрель",
        difficulty: 6,
        required_resources: "3 Сталь, 2 Энергоячейка, 1 Пластик, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 1
    },
    {
        name: "Резак",
        difficulty: 7,
        required_resources: "1 Каронис, 2 Пласталь, 1 ионид, 1 Тектит",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 3
    },
    {
        name: "Промышленный молот",
        difficulty: 6,
        required_resources: "4 Сталь, 1 Тектит",
        required_facility_types: [
            "Инженерное",
            "кузнечное"
        ],
        tech_tier: 2
    },
    {
        name: "Сипаха",
        difficulty: 7,
        required_resources: "5 Сталь, 1 Кожа",
        required_facility_types: [
            "Кузнечное"
        ],
        tech_tier: 2
    },
    {
        name: "Револьвер",
        difficulty: 6,
        required_resources: "4 сталь, 1 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Серкский бластер",
        difficulty: 8,
        required_resources: "2 ионид, 2 Энергоячейка, 2 Электронные компоненты, 2 Пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Ручная пушка",
        difficulty: 5,
        required_resources: "5 Шкарки, 1 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Игломёт (пистолет-инъектор)",
        difficulty: 7,
        required_resources: "4 Химикаты, 2 Сталь, 1 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "ЭМИ-излучатель",
        difficulty: 9,
        required_resources: "3 Ионид, 2 Пласталь, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Термоплюй",
        difficulty: 7,
        required_resources: "1 бронелит, 2 Пласталь, 2 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Карманный диссонатор",
        difficulty: 6,
        required_resources: "1 ионид, 2 Пласталь, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Энлимийский лиур",
        difficulty: 6,
        required_resources: "2 сталь, 3 Пластик, 1 Каронис, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Энергетическая ручная пушка",
        difficulty: 7,
        required_resources: "5 Шкарки, 1 Пластик, 1 Каронис, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Пистолет-пулемет",
        difficulty: 7,
        required_resources: "3 Сталь, 1 Пластик, 2 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "“Специалист”",
        difficulty: 8,
        required_resources: "2 Бронелит, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Лазерный пистолет",
        difficulty: 8,
        required_resources: "1 Каронис, 3 Пласталь, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Карманный защитник",
        difficulty: 8,
        required_resources: "1 ионид, 2 бронелит, 2 Энергоячейка, 2 Электронные компоненты, 1 Каронис",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Пистолет",
        difficulty: 6,
        required_resources: "4 сталь, 1 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Меналийский разрушитель",
        difficulty: 7,
        required_resources: "1 Каронис, 1 Энергоячейка, 1 Электронные компоненты, 5 Сталь, 1 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Меналийский разрушитель v. 2",
        difficulty: 11,
        required_resources: "2 Каронис, 2 Энергоячейка, 2 Электронные компоненты, 5 Сталь, 2 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Элласийская лазерная винтовка",
        difficulty: 8,
        required_resources: "6 Сталь, 1 Каронис, 1 ионид, 3 Электронные компоненты, 2 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Гизкоган",
        difficulty: 9,
        required_resources: "3 Сталь, 1 ионид, 1 Электронные компоненты, 2 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Атольский автомат",
        difficulty: 10,
        required_resources: "1 Каронис, 2 Энергоячейка, 2 Ионид, 2 Электронные компоненты, 2 Пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Атольный потрошитель",
        difficulty: 10,
        required_resources: "2 Ионид, 2 Пласталь, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Бум-винтовка",
        difficulty: 8,
        required_resources: "5 Пласталь, 2 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "\"Застрельщик\"",
        difficulty: 7,
        required_resources: "5 сталь, 1 Пластик, 1 Древесина",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Арбалет",
        difficulty: 10,
        required_resources: "2 бронелит, 1 ионид, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Электомагнитный подавитель",
        difficulty: 8,
        required_resources: "5 Шкарки, 2 ионид, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "“Ржавая королева”",
        difficulty: 7,
        required_resources: "5 Сталь, 1 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Громовое копье",
        difficulty: 6,
        required_resources: "6 Шкарки",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "\"Шиповник\"",
        difficulty: 10,
        required_resources: "3 Биомасса, 3 Химикаты, 2 люмит",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "“Кландор”",
        difficulty: 15,
        required_resources: "2 Бронелит, 2 Пласталь, 2 Ионид, 2 Энергоячейка, 3 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Псионический подавитель",
        difficulty: 14,
        required_resources: "2 Кристаллы псиолита, 2 Бронелит, 3 Энергоячейка, 6 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Лук",
        difficulty: 6,
        required_resources: "4 Пластик, 2 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Примитивный лук",
        difficulty: 4,
        required_resources: "4 Древесина, 2 Ткань",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Гоплонский повторитель",
        difficulty: 12,
        required_resources: "2 Каронис, 3 Энергоячейка, 5 Электронные компоненты, 4 Пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Плазмомет",
        difficulty: 14,
        required_resources: "2 Каронис, 3 Энергоячейка, 5 Электронные компоненты, 4 Пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Кислотный распылитель",
        difficulty: 12,
        required_resources: "3 Пласталь, 10 Химикаты, 3 Бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Линейный ускоритель",
        difficulty: 16,
        required_resources: "4 Дифазит, 4 Бронелит, 4 Пласталь, 4 Энергоячейка, 8 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Дуговой подавитель",
        difficulty: 14,
        required_resources: "3 Ионид, 4 Энергоячейка, 3 Пласталь, 6 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Лазеромёт",
        difficulty: 16,
        required_resources: "3 Каронис, 4 Энергоячейка, 6 Электронные компоненты, 5 Пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Плавильщик",
        difficulty: 15,
        required_resources: "2 Каронис, 6 Энергоячейка, 6 Электронные компоненты, 2 Пласталь, 2 Бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Серкская винтовка",
        difficulty: 16,
        required_resources: "2 Биомасса, 5 Химикаты, 2 люмит, 2 Бронелит",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Вакуумный разрыватель",
        difficulty: 18,
        required_resources: "6 Пласталь, 6 Энергоячейка, 6 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },


    {
        name: "Острая проволока",
        difficulty: 2,
        required_resources: "3 Сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Опрыскиватель",
        difficulty: 3,
        required_resources: "6 Химикаты, 2 Сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Виброэлемент",
        difficulty: 4,
        required_resources: "2 Энергоячейка, 2 Электронные компоненты, 1 пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Роза шипов",
        difficulty: 10,
        required_resources: "10 Химикаты, 4 Биомасса",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Защитные модификации",
        difficulty: 4,
        required_resources: "2 Пласталь, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Детонатор",
        difficulty: 6,
        required_resources: "1 бронелит, 2 Сталь, 4 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Закреплённый ствол",
        difficulty: 6,
        required_resources: "3 Сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Пневмопривод",
        difficulty: 5,
        required_resources: "2 Сталь, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Телескопический приклад",
        difficulty: 4,
        required_resources: "2 Тектит, 2 Сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Оптический прицел",
        difficulty: 6,
        required_resources: "2 Пластик, 1 сталь, 1 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Штык-клинок",
        difficulty: 4,
        required_resources: "2 Сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Удлинитель ствола",
        difficulty: 6,
        required_resources: "2 Энергоячейка, 6 Электронные компоненты, 1 пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Сошка",
        difficulty: 4,
        required_resources: "3 Сталь, 2 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Глушитель",
        difficulty: 5,
        required_resources: "4 Тектит, 2 Сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Шаг-механизм",
        difficulty: 7,
        required_resources: "3 Бронелит, 3 Энергоячейка, 6 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Наездник",
        difficulty: 12,
        required_resources: "1 пласталь, 2 Биомасса, 10 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Трасс-пасс",
        difficulty: 10,
        required_resources: "2 Энергоячейка, 1 дифазит, 1 бронелит, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Ускоритель потока",
        difficulty: 12,
        required_resources: "1 гравитон, 2 Бронелит, 4 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Подзарядник",
        difficulty: 6,
        required_resources: "1 сталь, 3 Энергоячейка, 4 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Шоковый модуль",
        difficulty: 7,
        required_resources: "2 Ионид, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Преобразователь мерностей",
        difficulty: 20,
        required_resources: "2 Гравитон, 2 Дифазит, 6 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Симба",
        difficulty: 8,
        required_resources: "2 Люмит, 3 Биомасса, 6 Химикаты",
        required_facility_types: [
            "Лабораторное",
            "инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Спецдок",
        difficulty: 10,
        required_resources: "1 Пласталь, 1 бронелит, 1 Энергоячейка, 3 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Зарядпак",
        difficulty: 6,
        required_resources: "3 Энергоячейка, 4 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },


    {
        name: "Легкая защита головы",
        difficulty: 3,
        required_resources: "1 Кожа, 1 Ткань",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Средняя защита головы",
        difficulty: 5,
        required_resources: "2 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Тяжелая защита головы",
        difficulty: 7,
        required_resources: "1 бронелит, 1 пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Легкая защита тела",
        difficulty: 5,
        required_resources: "3 Кожа, 3 Ткань",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Средняя защита тела",
        difficulty: 7,
        required_resources: "6 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Тяжелая защита тела",
        difficulty: 9,
        required_resources: "3 Бронелит, 3 Пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Легкая защита рук",
        difficulty: 4,
        required_resources: "1 Кожа, 2 Ткань",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Средняя защита рук",
        difficulty: 6,
        required_resources: "3 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Тяжелая защита рук",
        difficulty: 8,
        required_resources: "2 Бронелит, 1 пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Легкая защита ног",
        difficulty: 4,
        required_resources: "2 Кожа, 1 Ткань",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Средняя защита ног",
        difficulty: 6,
        required_resources: "3 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Тяжелая защита ног",
        difficulty: 8,
        required_resources: "2 Пласталь, 1 бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },


    {
        name: "Армированные пластины",
        difficulty: 4,
        required_resources: "2 Сталь, 1 пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Гибкие армированные пластины",
        difficulty: 6,
        required_resources: "1 Тектит, 2 Бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Гибкие пластины",
        difficulty: 6,
        required_resources: "3 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Многослойные пластины",
        difficulty: 6,
        required_resources: "2 пласталь, 2 бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Антиэнергетические пластины",
        difficulty: 7,
        required_resources: "1 ионид, 2 Бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Живая ткань",
        difficulty: 10,
        required_resources: "3 Биомасса, 6 Химикаты, 1 люмит, 1 Тектит",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Биосимулирующие пластины",
        difficulty: 7,
        required_resources: "6 Химикаты, 1 Биомасса, 2 Люмит",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Утепление",
        difficulty: 4,
        required_resources: "2 Кожа, 2 Ткань",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Облегчение",
        difficulty: 4,
        required_resources: "2 Ткань",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Терморегуляторы",
        difficulty: 5,
        required_resources: "1 Энергоячейка, 1 Электронные компоненты, 3 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Герметизация",
        difficulty: 6,
        required_resources: "4 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },


    {
        name: "Обычный щит",
        difficulty: 4,
        required_resources: "2 Древесина, 1 шкарки",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Щит из пластали",
        difficulty: 6,
        required_resources: "4 Пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Бронелитовый щит",
        difficulty: 6,
        required_resources: "4 Бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Энергощит",
        difficulty: 8,
        required_resources: "2 Сталь, 4 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Раздвижной щит",
        difficulty: 10,
        required_resources: "2 Сталь, 2 Бронелит, 2 Пласталь, 2 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },


    {
        name: "ПИСП",
        difficulty: 6,
        required_resources: "1 сталь, 2 Энергоячейка, 2 электронные компоненты, 1 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "АПЭЩ",
        difficulty: 10,
        required_resources: "1 бронелит, 4 Энергоячейка, 8 электронные компоненты, 1 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "ЭГРЗС",
        difficulty: 10,
        required_resources: "1 пласталь, 5 Энергоячейка, 10 электронные компоненты, 1 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "КЗЭ",
        difficulty: 8,
        required_resources: "1 сталь, 3 Энергоячейка, 3 электронные компоненты, 1 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "КМ",
        difficulty: 10,
        required_resources: "1 бронелит, 4 Энергоячейка, 4 электронные компоненты, 1 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "СПРЗИ",
        difficulty: 6,
        required_resources: "1 сталь, 2 Энергоячейка, 2 электронные компоненты, 1 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },


    {
        name: "Резонирующий музыкант",
        difficulty: 20,
        required_resources: "1 метеоритное железо, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Биоперчатка с ответной реакцией",
        difficulty: 16,
        required_resources: "3 Биомасса, 6 Химикаты, 3 Тектит, 1 сканирование мозга опытного фехтовальщика",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Эбеновые глаза",
        difficulty: 12,
        required_resources: "10 Химикаты, 2 тизид, 1 черная сущность",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Усиливающий паразит",
        difficulty: 12,
        required_resources: "10 Химикаты, 4 Биомасса, 1 биоинструкция",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Помощники ходьбы",
        difficulty: 12,
        required_resources: "1 Биомасса, 10 Химикаты, 1 сацеллово корневище",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Зрячая корона",
        difficulty: 12,
        required_resources: "1 разумный глаз, 10 Золото, 1 тизид",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Диск гнева",
        difficulty: 12,
        required_resources: "1 солнце гнева, 2 Люмит",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Средоточие души",
        difficulty: 12,
        required_resources: "1 Кристаллы псиолита, 1 кристалл прозрения, 1 люмит",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Миниатюрный генератор помех",
        difficulty: 12,
        required_resources: "1 гравитон, 1 нанитный переключатель, 1 бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Меняющийся инструмент",
        difficulty: 12,
        required_resources: "2 живой металл",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Защитный браслет",
        difficulty: 12,
        required_resources: "1 нанитный переключатель, 1 тизид, 1 бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Вторая кожа",
        difficulty: 12,
        required_resources: "1 живая плоть, 3 Биомасса, 6 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Окаменевший лоскут",
        difficulty: 12,
        required_resources: "1 пепельная плоть, 3 Биомасса, 6 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Кулачные когти",
        difficulty: 10,
        required_resources: "2 Люмит, 2 Бронелит, 10 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Ползучая тьма",
        difficulty: 12,
        required_resources: "1 черная сущность, 10 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Лечащий распылитель",
        difficulty: 3,
        required_resources: "1 Пластик, 2 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 1
    },
    {
        name: "Автоматический автономный исцелитель",
        difficulty: 5,
        required_resources: "2 Биомасса, 4 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Автодок",
        difficulty: 8,
        required_resources: "1 Энергоячейка, 3 Электронные компоненты, 2 Сталь, 5 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Чинаниты",
        difficulty: 4,
        required_resources: "1 Тизид, 2 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Термозаплатка",
        difficulty: 4,
        required_resources: "2 сталь, 2 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Пиявка Кальсона",
        difficulty: 4,
        required_resources: "1 сталь, 1 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Жидкая ярость",
        difficulty: 5,
        required_resources: "1 сталь, 2 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "«Пурпур»",
        difficulty: 5,
        required_resources: "3 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Жутч",
        difficulty: 5,
        required_resources: "1 Биомасса, 1 люмит, 1 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Эмиттер решительности",
        difficulty: 5,
        required_resources: "2 электронные компоненты, 1 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Нестабильная бомба",
        difficulty: 2,
        required_resources: "1 шкарки, 1 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Железная семянка",
        difficulty: 5,
        required_resources: "2 Химикаты, 2 пласталь",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Энергограната",
        difficulty: 5,
        required_resources: "1 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Поглощающая бомба",
        difficulty: 6,
        required_resources: "2 Ионид, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Грубый волнообразующий генератор",
        difficulty: 6,
        required_resources: "2 Ионид, 2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Личинка Лето",
        difficulty: 8,
        required_resources: "2 Биомасса, 4 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Гравибомба",
        difficulty: 7,
        required_resources: "1 гравитон, 1 сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Пневмодротик",
        difficulty: 4,
        required_resources: "2 шкарки",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Вонзающийся шип",
        difficulty: 6,
        required_resources: "2 Сталь, 1 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Метательное электрожало",
        difficulty: 6,
        required_resources: "1 Сталь, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Боевой взломщик",
        difficulty: 8,
        required_resources: "2 Энергоячейка, 2 Электронные компоненты, 1 Пластик",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Подзарядник",
        difficulty: 6,
        required_resources: "2 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "\"Разгонщик\"",
        difficulty: 6,
        required_resources: "2 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Одноразовый поглотитель",
        difficulty: 8,
        required_resources: "1 Каронис, 1 ионид, 1 сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Перегрузочный дрон-снаряд",
        difficulty: 8,
        required_resources: "1 ионид, 1 сталь, 1 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Локальный землетряс",
        difficulty: 8,
        required_resources: "2 Энергоячейка, 2 Электронные компоненты, 1 пласталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Телепортирующее кольцо",
        difficulty: 10,
        required_resources: "2 Энергоячейка, 1 гравитон, 1 сталь, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Ослепитель",
        difficulty: 8,
        required_resources: "2 Энергоячейка, 2 Электронные компоненты, 1 сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Рыцарский оруженосец",
        difficulty: 8,
        required_resources: "1 гравитон, 1 сталь, 1 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Силки из густого воздуха",
        difficulty: 6,
        required_resources: "1 сталь, 4 Химикаты, 1 тизид",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Кол корневища",
        difficulty: 16,
        required_resources: "1 Древесина, 16 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Гравикуб",
        difficulty: 7,
        required_resources: "1 гравитон, 1 сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Энергоперчатка изгнания",
        difficulty: 8,
        required_resources: "1 гравитон, 1 сталь, 1 Тектит, 1 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Сегментарный двойной генератор светового щита",
        difficulty: 10,
        required_resources: "2 Энергоячейка, 1 Каронис, 1 сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Усталость",
        difficulty: 5,
        required_resources: "6 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Жужжащие мухи",
        difficulty: 5,
        required_resources: "1 Пластик, 1 тизид",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Подавитель воли",
        difficulty: 5,
        required_resources: "1 Электронные компоненты, 1 Пластик, 2 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Ментальный супрессор",
        difficulty: 5,
        required_resources: "2 Электронные компоненты, 1 Пластик, 1 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Нарушитель",
        difficulty: 6,
        required_resources: "2 ионид, 1 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Путающий взломщик",
        difficulty: 6,
        required_resources: "1 Энергоячейка, 1 сталь, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Бронечервь",
        difficulty: 5,
        required_resources: "1 Биомасса, 2 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Младший боевой помощник",
        difficulty: 10,
        required_resources: "1 Энергоячейка, 1 Электронные компоненты, 1 бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Дисруптор",
        difficulty: 10,
        required_resources: "1 Энергоячейка, 1 Электронные компоненты, 1 бронелит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Глушилка",
        difficulty: 10,
        required_resources: "1 Энергоячейка, 1 Электронные компоненты, 1 сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Фазировочное кольцо",
        difficulty: 10,
        required_resources: "1 дифазит, 1 сталь, 1 Энергоячейка",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },


    {
        name: "Капкан",
        difficulty: 4,
        required_resources: "4 шкарки",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Мина",
        difficulty: 5,
        required_resources: "3 Сталь, 2 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Острый капкан",
        difficulty: 6,
        required_resources: "3 шкарки, 1 сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Осколочная мина",
        difficulty: 8,
        required_resources: "3 сталь, 1 Пласталь, 7 Химикаты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Энерголовушка",
        difficulty: 6,
        required_resources: "1 Энергоячейка, 2 Сталь, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Энергомина",
        difficulty: 8,
        required_resources: "3 Энергоячейка, 2 пласталь, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Ионная мина",
        difficulty: 6,
        required_resources: "1 ионид, 1 пласталь, 3 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Ионная ловушка",
        difficulty: 8,
        required_resources: "1 ионид, 1 сталь, 2 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Вакуумная мина",
        difficulty: 10,
        required_resources: "1 гравитон, 1 дифазит, 2 Пласталь, 1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 3
    },
    {
        name: "Автосеть",
        difficulty: 5,
        required_resources: "4 Тектит, 2 Сталь",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Ловушка Альмо",
        difficulty: 6,
        required_resources: "2 Энергоячейка, 2 Сталь, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Газовая мина",
        difficulty: 6,
        required_resources: "4 Химикаты, 2 Сталь",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Газовая мина с нейротоксином",
        difficulty: 10,
        required_resources: "10 Химикаты, 2 Сталь",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },


    {
        name: "Витаксит",
        difficulty: 8,
        required_resources: "10 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Кавидацит",
        difficulty: 6,
        required_resources: "4 Химикаты, 2 Травы, 1 корошка",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Алгемта",
        difficulty: 5,
        required_resources: "1 аромалиск, 4 Травы",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Метарал",
        difficulty: 5,
        required_resources: "1 аромалиск, 4 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Самидол",
        difficulty: 10,
        required_resources: "2 аромалиск, 1 Биомасса, 10 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Фенофазин",
        difficulty: 5,
        required_resources: "1 малийка, 3 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Фенофазиновый пластырь",
        difficulty: 4,
        required_resources: "1 малийка, 2 Травы, 1 Ткань",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 1
    },
    {
        name: "Амбифилак",
        difficulty: 5,
        required_resources: "6 Химикаты, 2 Травы",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Мазь Дзыбмяури",
        difficulty: 5,
        required_resources: "1 корошка, 3 Травы",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Кабит",
        difficulty: 7,
        required_resources: "12 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Настойка Фозикса",
        difficulty: 6,
        required_resources: "2 фроша, 6 Травы",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Спродекс",
        difficulty: 6,
        required_resources: "4 Химикаты, 4 Травы",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Кабарсис",
        difficulty: 5,
        required_resources: "1 корошка, 3 Травы",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Интубелиум",
        difficulty: 10,
        required_resources: "18 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Темприум",
        difficulty: 4,
        required_resources: "1 электронные компоненты, 1 Энергоячейка, 1 травы",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 1
    },
    {
        name: "Колкума",
        difficulty: 8,
        required_resources: "2 минералы, 2 Травы, 2 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Дермилак",
        difficulty: 4,
        required_resources: "1 регас, 1 аромалиск",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 1
    },
    {
        name: "Ивалициновые пластыри",
        difficulty: 4,
        required_resources: "2 Травы, 1 малийка, 1 Ткань",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 1
    },
    {
        name: "Камбипиловая кислота",
        difficulty: 5,
        required_resources: "2 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 1
    },
    {
        name: "Гремучка",
        difficulty: 5,
        required_resources: "1 корошка, 2 Травы",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Эликсир Калисты",
        difficulty: 6,
        required_resources: "1 малийка, 1 фроша, 2 Травы",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 1
    },
    {
        name: "Градилум",
        difficulty: 5,
        required_resources: "1 корошка, 1 фроша",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 1
    },
    {
        name: "Дофиламиний",
        difficulty: 5,
        required_resources: "4 Химикаты, 1 фроша",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Гаморидабол",
        difficulty: 6,
        required_resources: "4 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 1
    },
    {
        name: "Контенгальская радость",
        difficulty: 6,
        required_resources: "3 Химикаты, 2 Травы",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Шассанские семечки",
        difficulty: 8,
        required_resources: "4 Травы",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Корпидекс",
        difficulty: 5,
        required_resources: "5 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Окрим",
        difficulty: 7,
        required_resources: "1 корошка, 4 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Регастум",
        difficulty: 5,
        required_resources: "1 регас, 1 малийка, 2 Травы",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 1
    },
    {
        name: "Регастумные пластыри",
        difficulty: 4,
        required_resources: "1 регас, 1 фроша, 1 Ткань",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 1
    },
    {
        name: "Эликсир Жуанды",
        difficulty: 6,
        required_resources: "1 аромалиск, 4 Травы",
        required_facility_types: [
            "Лабораторное",
            "алхимическое"
        ],
        tech_tier: 1
    },
    {
        name: "Кажачбан",
        difficulty: 3,
        required_resources: "4 Травы",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 1
    },
    {
        name: "Дексонапомалин",
        difficulty: 4,
        required_resources: "4 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Анадамин",
        difficulty: 4,
        required_resources: "5 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Псиалкан",
        difficulty: 1,
        required_resources: "1 Псиолит-бета",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "«Элекручки»",
        difficulty: 5,
        required_resources: "1 Энергоячейка, 1 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "«ТЭМИ»",
        difficulty: 10,
        required_resources: "2 Энергоячейка, 2 Электронные компоненты",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "ARK",
        difficulty: 10,
        required_resources: "6 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Ирандам",
        difficulty: 10,
        required_resources: "6 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Формула Фёлиуса",
        difficulty: 10,
        required_resources: "6 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Краст",
        difficulty: 10,
        required_resources: "6 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "DEX-5",
        difficulty: 20,
        required_resources: "12 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Коренья фроши",
        difficulty: 8,
        required_resources: "1 фроша, 2 Травы",
        required_facility_types: [
            "Алхимическое"
        ],
        tech_tier: 1
    },
    {
        name: "Обработанный термовик",
        difficulty: 6,
        required_resources: "3 Травы",
        required_facility_types: [
            "Алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Зёрна малийки",
        difficulty: 6,
        required_resources: "2 малийка",
        required_facility_types: [
            "Алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Нишукское желе",
        difficulty: 6,
        required_resources: "3 Травы",
        required_facility_types: [
            "Алхимическое"
        ],
        tech_tier: 3
    },
    {
        name: "Боевой напиток Штогга",
        difficulty: 6,
        required_resources: "1 фроша, 1 Травы",
        required_facility_types: [
            "Алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Джулба",
        difficulty: 6,
        required_resources: "3 Травы",
        required_facility_types: [
            "Алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Кука-в-туке",
        difficulty: 6,
        required_resources: "3 Травы",
        required_facility_types: [
            "Алхимическое"
        ],
        tech_tier: 2
    },
    {
        name: "Чистый псиолит-бета",
        difficulty: 4,
        required_resources: "1 Кристаллы псиолита",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 1
    },
    {
        name: "Псиолит-один (псиолит-бета-один)",
        difficulty: 6,
        required_resources: "1 Псиолит-бета, 2 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 2
    },
    {
        name: "Дуолит",
        difficulty: 8,
        required_resources: "1 Кристаллы псиолита, 4 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Максолит",
        difficulty: 8,
        required_resources: "1 Кристаллы псиолита, 4 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Сенсолит",
        difficulty: 12,
        required_resources: "1 Кристаллы псиолита, 8 Химикаты",
        required_facility_types: [
            "Лабораторное"
        ],
        tech_tier: 3
    },
    {
        name: "Набор снаряжения",
        difficulty: 6,
        required_resources: "8 Шкарки, 8 Ткань",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Набор снаряжения",
        difficulty: 6,
        required_resources: "4 Сталь, 4 Тектит",
        required_facility_types: [
            "Инженерное"
        ],
        tech_tier: 2
    },
    {
        name: "Набор инструментов",
        difficulty: 8,
        required_resources: "6 Сталь, 6 Древесина",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 1
    },
    {
        name: "Переносное лабораторное снар",
        difficulty: 12,
        required_resources: "6 Пластик, 1 люмит, 6 Сталь",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 1
    },
    {
        name: "Переносной компьютер",
        difficulty: 12,
        required_resources: "8 Электронные компоненты, 2 Энергоячейка, 4 Сталь",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 1
    },
    {
        name: "Верстак",
        difficulty: 14,
        required_resources: "4 Древесина, 8 Сталь, 2 Пласталь, 2 Пластик",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 1
    },
    {
        name: "Механизированный верстак",
        difficulty: 14,
        required_resources: "10 Сталь, 4 Пласталь, 6 Пластик, 4 Тектит",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 2
    },
    {
        name: "Лабораторное рабочее место",
        difficulty: 14,
        required_resources: "3 Люмит, 8 Тектит, 12 Пластик, 8 Сталь",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 2
    },
    {
        name: "Автоматизированное лабораторное рабочее место",
        difficulty: 20,
        required_resources: "5 Люмит, 10 Тектит, 16 Пластик, 10 Сталь",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 2
    },
    {
        name: "Компьютерное оборудование",
        difficulty: 16,
        required_resources: "16 Электронные компоненты, 4 Энергоячейка, 8 Сталь, 2 Пластик",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 1
    },
    {
        name: "Репликатор",
        difficulty: 20,
        required_resources: "25 Электронные компоненты, 10 Энергоячейка, 20 Тектит, 20 Пластик, 10 Пласталь",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 2
    },
    {
        name: "Алхимический стол",
        difficulty: 6,
        required_resources: "6 Древесина",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 1
    },
    {
        name: "Простое литейное оборудование",
        difficulty: 12,
        required_resources: "20 Сталь, 5 Пластик",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 1
    },
    {
        name: "Мастерская",
        difficulty: 16,
        required_resources: "12 Древесина, 24 Сталь, 8 Пласталь, 8 Пластик",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 1
    },
    {
        name: "Автоматизированная мастерская",
        difficulty: 20,
        required_resources: "30 Сталь, 12 Пласталь, 18 Пластик, 12 Тектит, 20 Электронные компоненты, 6 Энергоячейка",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 2
    },
    {
        name: "Химико-биологическая лаборатория",
        difficulty: 20,
        required_resources: "9 Люмит, 24 Тектит, 36 Пластик, 24 Сталь, 25 Электронные компоненты, 8 Энергоячейка",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 2
    },
    {
        name: "Суперкомпьютер",
        difficulty: 18,
        required_resources: "24 Электронные компоненты, 10 Энергоячейка, 14 Сталь, 6 Пластик",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 2
    },
    {
        name: "Мегапликатор",
        difficulty: 50,
        required_resources: "30 Бронелит, 30 Пласталь, 60 Электронные компоненты, 2 гравитон, 4 дифазит, 20 Энергоячейка, 60 Тектит",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 2
    },
    {
        name: "Кузница-мастерская",
        difficulty: 12,
        required_resources: "16 Сталь, 20 Древесина",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 1
    },
    {
        name: "Сложное литейное оборудование",
        difficulty: 18,
        required_resources: "40 Сталь, 10 Пластик",
        required_facility_types: [
            "Литейное"
        ],
        tech_tier: 2
    }
]

/**
 * Make any changes you need to make to the database here
 */
async function up () {
    const resourcesMap = await getRecordsMap("Resource");
    const facilityTypesMap = await getRecordsMap("FacilityType");

    return new Promise(async (resolve, reject) => {
        await blueprints.map(async (blueprint) => {
            try {
                // Check whether facility type(s) is(are) valid
                const requiredFacilityTypes = blueprint.required_facility_types.map((requiredFacilityTypeName) => {
                    const facilityTypeId = facilityTypesMap[capitalizeFirstLetter(requiredFacilityTypeName)];
                    if (!facilityTypeId) throw new Error(`Trying to use unknown facility type: ${requiredFacilityTypeName}`);
                    return { type_id: facilityTypeId, tech_tier: blueprint.tech_tier }
                })

                // Make array of objects with info about required resources from string
                const requiredResources = blueprint.required_resources.match(/\d+ [^,]+/g).map((requiredResourceString) => {
                    const parts = /(\d+) ([^,]+)/.exec(requiredResourceString);
                    const requiredResourceId = resourcesMap[capitalizeFirstLetter(parts[2])]
                    if (!requiredResourceId) throw new Error(`Trying to use unknown resource: ${parts[2]}`);
                    return { _id: requiredResourceId, amount: parts[1] }
                })

                await model("Blueprint").create({
                    name: blueprint.name,
                    required_resources: requiredResources,
                    required_facilities: requiredFacilityTypes,
                    difficulty: blueprint.difficulty
                });
            } catch (e) {
                e.message += ` in \"${blueprint.name}\"`
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
