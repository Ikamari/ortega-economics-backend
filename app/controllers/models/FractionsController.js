// Controller foundation
const ModelController = require("./ModelController");
// Models
const FractionModel = require("../../models/Fraction");

class FractionsController extends ModelController {

    static getModel() {
        return FractionModel;
    }

    createRoutes(router) {
        router.get("/:id/resources", (request, response) => {
            this.findById(request, response, (document) => {
                document.resources.then((resources) => (response.status(200).send(resources)))
            });
        });

        router.get("/:id/members", (request, response) => {
            this.findById(request, response, (document) => {
                document.members.then((members) => (response.status(200).send(members)))
            });
        });
    }

}

module.exports = FractionsController;