// Server
const express    = require("express");
const bodyParser = require("body-parser");

class Controller {

    createRoutes(router) {}

    getRouter() {
        const router = express.Router();
        router.use(bodyParser.urlencoded({extended: true}));
        router.use(bodyParser.json());
        this.createRoutes(router);
        return router;
    }

}

module.exports = Controller;