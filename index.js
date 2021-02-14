const http = require('http');
const fetch = require('node-fetch');
var stockData = {TSLA: {
    '2021-02-12': {
      open: '801.26',
      high: '817.33',
      low: '785.3306',
      close: '816.12',
      volume: undefined
    },
 
  }};

function getStockData(StockSymbol){
    const API_Key = 'MFBETSKQD126AMHH';
   
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&apikey=${API_Key}`
    
    let settings = { method: "Get" };

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {

            if (json.hasOwnProperty('Note')) {
                console.log("API timeout retrying in 60s");
                setTimeout(() => {getStockData(StockSymbol)}, 60000);
            }
            
            var stock = {};
            
            for(var key in json['Time Series (Daily)']){
                console.log("PRINTING KEY"+key);
                stock[key]={
                    open:json['Time Series (Daily)'][key]['1. open'],
                    high:json['Time Series (Daily)'][key]['2. high'],
                    low:json['Time Series (Daily)'][key]['3. low'],
                    close:json['Time Series (Daily)'][key]['4. close'],
                    volume:json['Time Series (Daily)'][key]['5. volume']
                };
                
            }
            console.log("METADATA "+ json['Meta Data']);
            stockData[json['Meta Data']['2. Symbol']]=stock;

    }).catch((err) =>{console.log("ERROR IN FETCH FROM AV "+err+"\n")});
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
server.on('request', async (req, response) => {
    var symbol = req.url.substring(1);
    isInMem = checkMemory(symbol);
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = 200; // 200 = OK
    if (isInMem == false){
        getStockData(symbol);
    }    
    response.write(JSON.stringify(stockData[symbol]));
    response.end();
});
server.listen(3005);