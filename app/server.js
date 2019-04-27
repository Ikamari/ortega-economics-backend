// Server
const app = require("./app");
const { configProps, getConfigProp } = require("./config");
// Database
const mongoose = require("mongoose");

const hostname = configProps[process.env.NODE_ENV].hostname;
const port     = configProps[process.env.NODE_ENV].port;

const onDBConnectionSuccess = () => {
    global.isReady = true;
    console.log("Successfully connected to DB");
};

const onDBConnectionError = (error) => {
    console.error("Couldn't connect to the DB:", error);
    process.exit();
};

const server = app.listen(port, hostname, () => {
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