const http = require('http');
const fetch = require('node-fetch');
var stockData = {};

function getStockData(StockSymbol){
    const API_Key = 'MFBETSKQD126AMHH';
   
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&apikey=${API_Key}`
    
    let settings = { method: "Get" };

    if(StockSymbol=="favicon.ico"){
        return undefined;
    }

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            if (json.hasOwnProperty('Note')) {
                console.log("API timeout retrying in 60s");
                setTimeout(() => {getStockData(StockSymbol)}, 60000);
            }
            
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
            stockData[json['Meta Data']['2. Symbol']]=stock;

    }).catch((err) =>console.log("ERROR IN FETCH FROM AV "+err+"\n"));
}

function checkMemory(symbol) {
    
    var isInMem = false;
    for(var key in stockData){
        if (key == symbol){
            isInMem = true;
        }
    }
    console.log(isInMem,symbol)
    return isInMem;
}


const server = http.createServer();
server.on('request', (req, response) => {
    var symbol = req.url.substring(1);
    isInMem = checkMemory(symbol);
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = 200; // 200 = OK
    if (isInMem == false){
        getStockData(symbol);
    }
    var data = JSON.stringify(stockData[symbol]);
    if(data==undefined){
        data="Please refresh page";
    }
    response.write(data);
    response.end();
});
server.listen(3005);