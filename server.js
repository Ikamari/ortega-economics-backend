// Server
const { configProps, getConfigProp } = require("./app/config");
// Database
const mongoose = require("mongoose");

// Load all models
require("./app/models");
// Schedule all jobs
require("./app/jobs")

const hostname = configProps[process.env.NODE_ENV || "prod"].hostname;
const port     = configProps[process.env.NODE_ENV || "prod"].port;

const onDBConnectionSuccess = () => {
    global.isReady = true;
    console.log("Successfully connected to DB");
};

const onDBConnectionError = (error) => {
    console.error("Couldn't connect to the DB:", error);
    process.exit();
};

const app = require("./app");
app.listen(port, hostname, () => {
    global.isReady     = false;
    global.configProps = configProps;
    global.config      = getConfigProp;

    mongoose.set("useCreateIndex", true);
    mongoose.connect(
        global.config("mongodb.url") + global.config("mongodb.db"),
        {useNewUrlParser: true}
    );

    global.db = mongoose.connection;
    global.db.on("error", (error) => onDBConnectionError(error));
    global.db.once("open", () => onDBConnectionSuccess());

    console.log(`Server running on http://${hostname}:${port}/`);
});