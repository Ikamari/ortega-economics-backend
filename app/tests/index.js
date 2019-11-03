const autotests = {
    "sandbox": require("./Sandbox"),
    "craft": require("./Craft"),
    "buildings": require("./Buildings")
};

const runAutotest = (testName) => {
    console.info(`Starting "${testName}" autotest`);
    return autotests[testName]()
        .then(() => {
            console.log(`Autotest "${testName}" successfully finished`)
        })
        .catch((error) => {
            console.error(`Autotest "${testName}" failed:`, error);
        })
};

module.exports = (testName) => {
    return new Promise((resolve) => {
        if (testName === "all") {
            Promise.all(
                Object.keys(autotests).map((testName) => runAutotest(testName))
            ).then(() => resolve(true))
        }
        else if (testName in autotests) {
            runAutotest(testName).then(() => resolve(true))
        }
        else {
            console.warn(`There's no autotests with name "${testName}"`)
        }
    })
};