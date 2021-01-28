const http = require('http');
const fetch = require('node-fetch');

var stockData = {};
async function getStockData(StockSymbol){
    const API_Key = 'MFBETSKQD126AMHH';
   
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&apikey=${API_Key}`
    
    let settings = { method: "Get" };

    await fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            
            var stock = {};
            
            for(var key in json['Time Series (Daily)']){
                
                stock[key]={
                    open:json['Time Series (Daily)'][key]['1. open'],
                    high:json['Time Series (Daily)'][key]['2. high'],
                    low:json['Time Series (Daily)'][key]['3. low'],
                    close:json['Time Series (Daily)'][key]['4. close'],
                    volume:json['Time Series (Daily)'][key]['5. volume']

                };
                
            }
            stockData[json["Meta Data"]["2. Symbol"]]=stock;
            
            
    });
}


console.log(stockData)

const server = http.createServer(function (req, res) {
    console.log(`${req.method} request received at ${req.url}`);
    
    var symbol = req.url.substring(1);
    var isInMem = false;
    for(var key in stockData){
        if (key == symbol){
            isInMem = true;
        }
    }
    console.log(isInMem,symbol)
    if (!isInMem){
        getStockData(symbol)
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200; // 200 = OK
    res.write(JSON.stringify(stockData));
    res.end();
    
});

server.listen(3000, function () {
    console.log("Listening on port http://localhost:3000");
});
