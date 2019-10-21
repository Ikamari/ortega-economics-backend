const tests = [];
tests["craft"] = require("./Craft");
tests["buildings"] = require("./Buildings");

const autotester = async (testName) => {
    console.info(`Trying to run "${testName}" autotests`);
    if (testName === "all") {
        await tests.map(async (test) => await test());
    }
    else if (tests[testName]) {
        await tests[testName]();
    }
    else {
        console.error(`There's no autotests with name "${testName}"`);
    }
}

module.exports = autotester;