// Controller foundation
const Controller = require("../Controller");
// Jobs
const FinishProductionCycle = require("../../jobs/FinishProductionCycle")

class JobsController extends Controller {

    createRoutes(router, Model) {
        router.get("/force-production-cycle", (request, response, next) => {
            FinishProductionCycle.handleFractions(false)
                .then(() => response.status(200).send("Ok!"))
                .catch(error => next(error));
        });
    }

}

module.exports = JobsController;