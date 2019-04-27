module.exports.exists = (Model) => ({
    validator: (id) => {
        return Model.countDocuments({ _id: id }).exec().then((amount) => {
            return amount > 0;
        });
    },
    message: props => `${props.path} must point to existing ${Model.modelName}'`
});