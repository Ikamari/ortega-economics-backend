// Server
const express = require("express");
const { validationResult } = require('express-validator');

class RequestError extends Error {

    constructor(message, content = null, httpCode = 400) {
        super(message);

        this.httpCode = httpCode;
        this.name     = this.constructor.name;
        this.content  = content ? `Bad request:\n${content}` : "Bad request";

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }

}

class Controller {

    createRoutes(router) {}

    checkValidation(request, next) {
        const result = validationResult(request);
        if (!result.isEmpty()) {
            let errorInfo = "";
            result.errors.map((error) => {
                errorInfo += `${error.param}: ${error.msg}\n`
            })
            next(new RequestError("Bad request", errorInfo))
            return false
        }
        return true
    }

    getRouter() {
        const router = express.Router();
        this.createRoutes(router);
        return router;
    }

}

module.exports              = Controller;
module.exports.RequestError = RequestError;