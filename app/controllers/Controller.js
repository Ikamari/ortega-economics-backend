// Server
const express              = require("express");
const { validationResult } = require("express-validator");
const ErrorResponse        = require("./ErrorResponse");

const wrap = fn => (...args) => fn(...args).catch(args[2]);

/**
 * @property {express.Router} router
 */
class Controller {

    constructor(skipRoutesCreation = false) {
        this.router = express.Router();
        if (!skipRoutesCreation) {
            this.createRoutes();
        }
    }

    createRoutes() {
        throw new Error(`createRoutes must be defined in ${this.constructor.name}`);
    }

    validate(request, next) {
        const result = validationResult(request);
        if (!result.isEmpty()) {
            let errorInfo = "";
            result.errors.map((error) => {
                errorInfo += `${error.param} - ${error.msg}\r\n`
            });
            next(new ErrorResponse(`Bad request:\r\n${errorInfo}`, 400));
            return false
        }
        return true
    }

    updateIfDefined(document, property, value, callback) {
        if (value !== "undefined") {
            if (typeof callback === "function") callback(value);
            document[property] = value;
        }
    }

    getRouter() {
        return this.router;
    }

}

module.exports      = Controller;
module.exports.wrap = wrap;