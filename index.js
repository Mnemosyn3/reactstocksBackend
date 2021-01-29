const http = require('http');
const fetch = require('node-fetch');

var stockData = {};
function getStockData(StockSymbol){
    const API_Key = 'MFBETSKQD126AMHH';
   
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&apikey=${API_Key}`
    
    let settings = { method: "Get" };

    fetch(url, settings)
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

async function checkMemory(symbol){
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
    return stockData;

}
console.log(stockData)

const server = http.createServer(function (req, res) {
    console.log(`${req.method} request received at ${req.url}`);
    
    var symbol = req.url.substring(1);
    result = checkMemory(symbol);
    console.log(result);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200; // 200 = OK
    res.write(JSON.stringify(result));
    res.end();
    
    
});

server.listen(3005, function () {
    console.log("Listening on port http://localhost:3005");
});
