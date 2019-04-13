/**
 * @param  {string}  path
 * @param  {boolean} useEnvironment
 * @return {*}
 */
module.exports.getConfigProp = (path, useEnvironment = true) => {
    const pathParts = path.split(".");
    let property    = global.configProps[useEnvironment ? process.env.NODE_ENV : pathParts[0]];

    if (!property) {
        throw `Requested undefined config property "${path}"`
    }

    for (let pathPartIndex = +!useEnvironment; pathPartIndex < pathParts.length; pathPartIndex++) {
        if (pathParts[pathPartIndex] in property) {
            property = property[pathParts[pathPartIndex]]
        } else {
            throw `Requested undefined config property "${path}"`
        }
    }

    return property;
};

module.exports.configProps = {
    prod: {
        "hostname": "127.0.0.1",
        "port": 3000,
        "mongodb": {
            "url": "mongodb://localhost:27017/",
            "db": "economy"
        }
    },
    dev: {
        "hostname": "127.0.0.1",
        "port": 3000,
        "mongodb": {
            "url": "mongodb://localhost:27017/",
            "db": "economy"
        }
    }
};