const exists = (Model) => ({
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

        return Model.countDocuments({
            _id: query
        }).exec().then((amount) => {
            return amount >= condition;
        });
    },
    message: props => `${props.path} must point to existing ${Model.modelName}`
});

const existsIn = (Models) => {
    if (!(Array.isArray(Models)) || Models.length <= 1) {
        throw new Error("existsIn validator must receive array of at least two models")
    }

    return {
        validator: (objectId) => {
            if (objectId === null) {
                return true;
            }

            let isValid = false;
            Models.map((Model) => {
                if (exists(Model).validator(objectId)) {
                    isValid = true;
                }
            })
            return isValid;
        },
        message: props => `${props.path} must point to existing:${Models.map((Model) => (" " + Model.modelName))}`
    }
}

module.exports.existsIn = existsIn
module.exports.exists   = exists