const http = require('http');
const fetch = require('node-fetch');

var stockDataArray = [];
async function getStockData(){
    const API_Key = 'MFBETSKQD126AMHH';
    let StockSymbol = "TSLA";
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&apikey=${API_Key}`
    //let url = "https://www.reddit.com/r/popular.json";
    let settings = { method: "Get" };

    await fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            
            stockDataArray.push({symbol:json["Meta Data"]["2. Symbol"]})
    });
}


const server = http.createServer(function (req, res) {
    console.log(`${req.method} request received at ${req.url}`);
    
   
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200; // 200 = OK
    res.write(JSON.stringify(stockDataArray.symbol));
    res.end();
    } 
});

server.listen(3000, function () {
    console.log("Listening on port http://localhost:3000");
});
