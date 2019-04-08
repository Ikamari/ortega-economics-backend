const server        = require("./controller");
const MongoDBClient = require("./database/MongoDBClient");

const hostname = "127.0.0.1";
const port = 3000;

/**
 * @param {MongoDBClient} client
 */
const onDBConnectionSuccess = (client) => {
    console.error("Successfully connected to DB");
};

const onDBConnectionError = (error) => {
    console.error("Couldn't connect to the DB:", error);
    process.exit();
};

server.listen(port, hostname, () => {
    const dbClient = new MongoDBClient(
        (client) => onDBConnectionSuccess(client),
        (error)  => onDBConnectionError(error)
    );
    console.log(`Server running at http://${hostname}:${port}/`);
});