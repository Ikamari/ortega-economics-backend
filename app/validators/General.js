module.exports.exists = (Model) => ({
    validator: (value) => {
        if (value === null) {
            return true;
        }

        let query;
        let condition;
        if (Array.isArray(value)) {
            query = { $in: value };
            condition = value.length;
        }
        else if (value instanceof Map) {
            const keys = Array.from(value.keys());
            query = { $in: keys };
            condition = keys.length;
        }
        else {
            query = value;
            condition = 1;
        }

        return Model.countDocuments({
            _id: query
        }).exec().then((amount) => {
            return amount >= condition;
        });
    },
    message: props => `${props.path} must point to existing ${Model.modelName}'`
});