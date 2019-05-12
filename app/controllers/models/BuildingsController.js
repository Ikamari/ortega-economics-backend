// Database
const { model }  = require("mongoose");
// Controller foundation
const Controller = require("../Controller");

class BuildingsController extends Controller {

    createRoutes(router) {
        router.post("/:id/resources", (request, response, next) => {
            model("Building").findById(request.params.id).then((document) => {
                if (!document) {
                    return response.status(500).send(`Can't find specified document`);
                }

                document.editResources(
                    request.body.resources,
                    request.body.strictCheck
                ).then(result => {
                    response.status(200).send(result)
                }).catch(error => next(error));

            }).catch(error => next(error))
        });
    }

}

module.exports = BuildingsController;