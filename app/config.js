const configProps = {
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

/**
 * @param  {string}  path
 * @param  {boolean} useEnvironment
 * @return {*}
 */
const getConfigProp = (path, useEnvironment = true) => {
    const pathParts = path.split(".");
    const env       = useEnvironment ? (process.env.NODE_ENV || "prod") : pathParts[0]
    let property    = configProps[env];

    if (!property) {
        throw new Error(`Requested undefined config property "${path}"`)
    }

    for (let pathPartIndex = +!useEnvironment; pathPartIndex < pathParts.length; pathPartIndex++) {
        if (pathParts[pathPartIndex] in property) {
            property = property[pathParts[pathPartIndex]]
        } else {
            throw new Error(`Requested undefined config property "${path}"`)
        }
    }

    return property;
};

module.exports.configProps   = configProps;
module.exports.getConfigProp = getConfigProp;