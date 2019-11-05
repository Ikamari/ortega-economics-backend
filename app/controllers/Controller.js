// Server
const express              = require("express");
const { validationResult } = require("express-validator");
const ErrorResponse        = require("./ErrorResponse");

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

    checkValidation(request, next) {
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

    getRouter() {
        return this.router;
    }

}

module.exports = Controller;