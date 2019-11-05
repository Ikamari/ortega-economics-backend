const Controller    = require("./Controller");
const ErrorResponse = require("./ErrorResponse");

// Server controllers can be accessed only from localhost
class ServerController extends Controller {

    constructor(skipRoutesCreation = false) {
        super(true);
        this.router.use(ServerController.checkWhetherLocalhost);
        if (!skipRoutesCreation) {
            this.createRoutes();
        }
    }

    static checkWhetherLocalhost(request, response, next) {
        const ip = request.connection.remoteAddress;
        if (ip !== "127.0.0.1") {
            // todo: save logs to file
            console.log(`${ip} tried to access endpoint for game server and was refused`);
            return next(new ErrorResponse("Forbidden", 403));
        }
        next();
    }

}

module.exports = ServerController;