const MongoClient = require("mongodb").MongoClient;
const Config      = require("../helpers/ConfigHelper");

module.exports = class MongoDBClient {

    /**
     * @constructor
     * @param {?Function} onSuccess
     * @param {?Function} onError
     */
    constructor(onSuccess = () => {}, onError = () => {}) {
        this.mongoClient = new MongoClient(
            Config.get("mongodb.url"),
            { useNewUrlParser: true }
        );

        this.mongoClient.connect((err, client) => {
            if (err) {
                onError(err)
            }
            this.db = client.db(Config.get("mongodb.db"));
            onSuccess(this);
        });
    }

    /**
     * @param  {String}    actionName
     * @param  {String}    collectionName
     * @param  {*}         parameters
     * @param  {?Function} callback
     * @return {?Promise}
     */
    executeRequest(actionName, collectionName, parameters, callback = null) {
        const collection = this.db.collection(collectionName);
        return collection[actionName](...parameters, callback ? (error, result) => {
            callback(!error, result, error);
        } : null)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    document
     * @param  {?Function} callback
     * @return {?Promise}
     */
    insertOne(collectionName, document, callback = null) {
        return this.executeRequest("insertOne", collectionName, [document], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}         collectionName
     * @param  {Array.<Object>} documents
     * @param  {Function}       callback
     * @return {?Promise}
     */
    insertMany(collectionName, documents, callback = null) {
        return this.executeRequest("insertMany", collectionName, [documents], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    documentsData
     * @param  {?Function} callback
     * @return {?Promise}
     */
    updateMany(collectionName, documentsData, callback = null) {
        return this.executeRequest("updateMany", collectionName, [documentsData], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    documentData
     * @param  {?Function} callback
     * @return {?Promise}
     */
    updateOne(collectionName, documentData, callback = null) {
        return this.executeRequest("updateOne", collectionName, [documentData], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    documentsData
     * @param  {?Function} callback
     * @return {?Promise}
     */
    find(collectionName, documentsData, callback = null) {
        return this.executeRequest("find", collectionName, [documentsData], null).toArray(callback ? (error, result) => {
            callback(!error, result, error);
        } : null)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    documentData
     * @param  {?Function} callback
     * @return {?Promise}
     */
    findOne(collectionName, documentData, callback = null) {
        return this.executeRequest("findOne", collectionName, [documentData], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    oldDocumentData
     * @param  {Object}    newDocumentData
     * @param  {?Function} callback
     * @return {?Promise}
     */
    findOneAndUpdate(collectionName, oldDocumentData, newDocumentData, callback = null) {
        return this.executeRequest("findOneAndUpdate", collectionName, [oldDocumentData, newDocumentData], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    oldDocumentData
     * @param  {Object}    newDocument
     * @param  {?Function} callback
     * @return {?Promise}
     */
    findOneAndReplace(collectionName, oldDocumentData, newDocument, callback = null) {
        return this.executeRequest("findOneAndReplace", collectionName, [oldDocumentData, newDocument], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    documentData
     * @param  {?Function} callback
     * @return {?Promise}
     */
    findOneAndDelete(collectionName, documentData, callback = null) {
        return this.executeRequest("findOneAndDelete", collectionName, [documentData], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    documentsData
     * @param  {?Function} callback
     * @return {?Promise}
     */
    deleteMany(collectionName, documentsData, callback = null) {
        return this.executeRequest("deleteMany", collectionName, [documentsData], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {Object}    documentData
     * @param  {?Function} callback
     * @return {?Promise}
     */
    deleteOne(collectionName, documentData, callback = null) {
        return this.executeRequest("deleteOne", collectionName, [documentData], callback)
    }

    /**
     * @methodOf MongoDBClient
     * @param  {String}    collectionName
     * @param  {?Function} callback
     * @return {?Promise}
     */
    drop(collectionName, callback = null) {
        return this.executeRequest("drop", collectionName, [], callback)
    }

};