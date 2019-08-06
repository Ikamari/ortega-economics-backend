// Database
const { model } = require("mongoose");

const exists = (ModelName) => ({
    validator: (objectId) => {
        if (objectId === null) {
            return true;
        }

        let query;
        let condition;
        if (Array.isArray(objectId)) {
            query = { $in: objectId };
            condition = objectId.length;
        }
        else if (objectId instanceof Map) {
            const keys = Array.from(objectId.keys());
            query = { $in: keys };
            condition = keys.length;
        }
        else {
            query = objectId;
            condition = 1;
        }

        return model(ModelName).countDocuments({
            _id: query
        }).exec().then((amount) => {
            return amount >= condition;
        });
    },
    message: props => `${props.path} must point to existing ${ModelName}`
});

const existsIn = (ModelNames) => {
    if (!(Array.isArray(ModelNames)) || ModelNames.length <= 1) {
        throw new Error("existsIn validator must receive an array (haystack) with at least two model names")
    }

    return {
        validator: (objectId) => {
            if (objectId === null) {
                return true;
            }

            let isValid = false;
            ModelNames.map((ModelName) => {
                if (exists(ModelName).validator(objectId)) {
                    isValid = true;
                }
            })
            return isValid;
        },
        message: props => `${props.path} must point to existing:${ModelNames.map((ModelName) => (" " + ModelName))}`
    }
}

const includes = (array) => {
    if (!(Array.isArray(array)) || array.length <= 1) {
        throw new Error("includes validator must receive an array (haystack) with at least two values")
    }

    return {
        validator: (value) => (array.includes(value.toString())),
        message: props => `${props.path} must be equal to:${array.map((value) => (" " + value))}`
    }
}

module.exports.existsIn = existsIn
module.exports.exists   = exists
module.exports.includes = includes