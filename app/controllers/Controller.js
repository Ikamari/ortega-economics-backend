// Server
const express = require("express");

class Controller {

    createRoutes(router) {}

    getRouter() {
        const router = express.Router();
        this.createRoutes(router);
        return router;
    }

}

module.exports = Controller;