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
            
            
            
    }).catch((err) =>{console.log(err)});
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
    isInMem = checkMemory(symbol)
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = 200; // 200 = OK
    if (isInMem == false){
        const API_Key = 'MFBETSKQD126AMHH';
   
        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${API_Key}`
        
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
                //console.log(stockData);
            }).then((response.write(JSON.stringify(stockData)))).catch((err) =>{console.log(err)});
    }else{
        //console.log(stockData);
    
        response.write(JSON.stringify(stockData[symbol]));
    }
    
    
    response.end();
});
server.listen(3005);