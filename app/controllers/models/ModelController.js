// Controller foundation
const Controller = require("../Controller");

class ModelController extends Controller {

    constructor() {
        super();
        this.Model = this.constructor.getModel()
    }

    static getModel() {
        throw new Error("getModel must be implemented")
    }

    findById(request, response, callback) {
        this.Model.findById(request.params.id, (error, document) => {
            if (error) {
                return response.status(500).send(`Can't get specified document of ${this.Model.collection.collectionName} collection: ${error.message}`);
            }
            if (!document) {
                return response.status(500).send(`Can't find document of ${this.Model.collection.collectionName} collection with specified id`);
            }
            callback(document)
        })
    }

}

module.exports = ModelController;