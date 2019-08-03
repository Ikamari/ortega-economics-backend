// Server
const { getConfigProp } = require("./app/config");
// Database
const mongoose        = require("mongoose");
const migrateMongoose = require("migrate-mongoose");

// Load all models
require("./app/models");
// Schedule all jobs
require("./app/jobs");

const hostname = getConfigProp("hostname");
const port     = getConfigProp("port");
const mongoUrl = getConfigProp("mongodb.url") + getConfigProp("mongodb.db");
const migrator = new migrateMongoose({
    migrationsPath:  "./database",
    templatePath:    null,         // The template to use when creating migrations needs up and down functions exposed
    dbConnectionUri: mongoUrl,
    collectionName:  "migrations", // collection name to use for migrations
    autosync:        true,         // if making a CLI app, set this to false to prompt the user, otherwise true
    cli:             true
});

const connectToDB = () => {
    console.log("Connecting to DB...")
    mongoose.set("useCreateIndex", true);
    mongoose.connect(mongoUrl, { useNewUrlParser: true });
    mongoose.connection
        .on("error", (error) => onDBConnectionError(error))
        .once("open", () => onDBConnectionSuccess());
}

const onDBConnectionSuccess = () => {
    console.log(`Successfully connected to DB\nRunning migrations...`);
    migrator.run("up")
        .then(() => {
            global.isReady = true;
            console.log(`Server running on http://${hostname}:${port}/`);
        })
        .catch((error) => {
            console.error("Couldn't run the migrations:", error);
            process.exit();
        });
};

const onDBConnectionError = (error) => {
    console.error("Couldn't connect to the DB:", error);
    process.exit();
};

const app = require("./app");
app.listen(port, hostname, () => {
    global.isReady = false;
    connectToDB();
});