class ErrorResponse extends Error {

    constructor(message, httpCode = 500) {
        super(message);

        this.httpCode = httpCode;
        this.name     = this.constructor.name;
        // todo: error that will be showed to user should be translated
        this.response = message;

        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }

}

module.exports = ErrorResponse;