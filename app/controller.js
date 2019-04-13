const http = require("http");

module.exports = http.createServer((request, response) => {
    if (!global.isReady) {
        response.statusCode = 503;
        response.setHeader("Content-Type", "text/plain");
        response.end(`Not ready`);
        return;
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    response.end(`Requested page: ${request.url}`);
});