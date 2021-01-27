const http = require('http');
const fetch = require('node-fetch');

function getStockData(symbol){
    let url = "https://www.reddit.com/r/popular.json";
    let settings = { method: "Get" };

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            return json;
    });
}


const server = http.createServer(function (req, res) {
    console.log(`${req.method} request received at ${req.url}`);
    if (req.url === '/html') {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200; // 200 = OK
        res.write("<h1>Demo page</h1>");
        res.end();
    } else if (req.url === '/plain') {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 200; // 200 = OK
        res.write("<h1>Demo page</h1>");
        res.end();
    } else if (req.url === '/json') {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200; // 200 = OK
        res.write(JSON.stringify({"firstName": "Harry", "lastName": "Potter"}));
        res.end();
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400; // 400 = Bad request
        res.write("<h1>Sorry, this page is not available</h1>");
        res.end();
    }
});

server.listen(3000, function () {
    console.log("Listening on port http://localhost:3000");
});
