const config = require("../config");

module.exports = class ConfigHelper {

    static get(path) {
        const pathParts = path.split(".");
        let property    = config[process.env.NODE_ENV];

        for (let pathPartIndex = 0; pathPartIndex < pathParts.length; pathPartIndex++) {
            if (pathParts[pathPartIndex] in property) {
                property = property[pathParts[pathPartIndex]]
            } else {
                throw "Requested undefined config property"
            }
        }

        return property;
    }

};