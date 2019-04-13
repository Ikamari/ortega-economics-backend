// Server
const server = require("./controller");
const { configProps, getConfigProp } = require("./config");
// Database
const mongoose = require("mongoose");
// Test
const Fraction = require("./models/Fraction");

const hostname = configProps[process.env.NODE_ENV].hostname;
const port     = configProps[process.env.NODE_ENV].port;

const onDBConnectionSuccess = () => {
    global.isReady = true;
    console.log("Successfully connected to DB");

    (new Fraction({ name: "Dudes" })).save();

    console.log(global.config("mongodb.db"))
};

const onDBConnectionError = (error) => {
    console.error("Couldn't connect to the DB:", error);
    process.exit();
};

server.listen(port, hostname, () => {
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

    console.log(`Server running at http://${hostname}:${port}/`);
});