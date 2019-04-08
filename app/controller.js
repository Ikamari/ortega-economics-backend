const http = require("http");

module.exports = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    response.end(`Requested page: ${request.url}`);
});