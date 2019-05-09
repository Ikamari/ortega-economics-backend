// Controller foundation
const Controller = require("../Controller");
// Models
const FractionModel = require("../../models/Fraction");

class FractionsController extends Controller {

    createRoutes(router) {
        router.get("/:id/resources", (request, response, next) => {
            FractionModel.findById(request.params.id).then(document => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }
                document.resources.then((resources) => (
                    response.status(200).send(resources)
                )).catch(error => next(error))
            }).catch(error => next(error));
        });

        router.get("/:id/members", (request, response, next) => {
            FractionModel.findById(request.params.id).then(document => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }
                document.members.then((members) => (
                    response.status(200).send(members)
                )).catch(error => next(error))
            }).catch(error => next(error));
        });
    }

}

module.exports = FractionsController;