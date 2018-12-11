"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getResponse(event) {
    //Implement getting query info, and return response here
    return ["HelloWorld"];
}
const request = require('request');

function requestPromise(url, method = "GET", headers = -1, data = -1) {
    var trans = {
        method: method,
        url: url,
    };
    if (headers != -1)
        trans.headers = headers;
    if (data != -1) {
        trans.data = data;
        trans.json = true;
    }
    return new Promise((resolve, reject) => {
        request(trans, (err, response, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}
async function filter(arr){
    var count=0;
    var outlier = 0.03
    console.log("arr",arr)
    for(var i=0;i<arr.length;i++){
        count += parseInt(arr[i])
    }
    var avg=count/arr.length
    console.log("avg",avg)

    for(var i=0;i<arr.length;i++){
        let percent=(parseInt(arr[i])/avg)
        if( percent < (1-outlier) || percent > (1+outlier) ){
            console.log("outlier",arr[i])
            arr.splice(i,1);
            console.log(arr)
            return(filter(arr))
        }
    }
    return avg

}
async function averageResponder(event){
    var  { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    var arr=[]
    endpointParams[0]="BTC"
    endpointParams[1]="USD"
    
    var tmp = await coinCapResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await coinbaseResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await cryptoCompareResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await bitfinexResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await poloniexResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await lakeResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await bitstampResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await coinMarketCapResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await coinDeskResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await krakenResponder(event)
    if(parseInt(tmp[0])>0)arr.push(tmp[0])
    tmp = await geminiResponder(event)
    console.log(arr)
    var avg = await filter(arr)
    return [""+avg]
    
    

}
var event = {queryId: 0,query: "price", endpoint: "DaveBTC", subscriber: 0, endpointParams: ["btc","usd"], onchainSub: false}
// cryptoCompareResponder(event)
// averageResponder(event);
coinMarketCapResponder(event);
// coinDeskResponder(event);
// krakenResponder(event);
// geminiResponder(event);
async function coinCapResponder(event) {
    // do stuff with these values
    const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    // var query=""
    // var endpointParams=["ETH", "BTC"];
    try{
    var coincapURL="http://coincap.io/page/"+endpointParams[0].toUpperCase();
    const body = await requestPromise(coincapURL);
    const json = JSON.parse(body);
    var price;
    
    var convert = "price_"+endpointParams[1].toLowerCase();
    if(json[convert])
        price=json[convert]
    else
        price=json["price_eth"]
    console.log("coincap",price)
    return [""+price];}
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }
}

async function coinbaseResponder(event) {
    // do stuff with these values
    const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    // var query=""
    // var endpointParams=["BTC","USD"];
    try{
        var urlParam = endpointParams[0]+"-"+endpointParams[1];
        var coinbaseURL="https://api.coinbase.com/v2/prices/"+urlParam+"/spot "
    
        const body = await requestPromise(coinbaseURL);
        const json = JSON.parse(body);
        var price;
        // console.log(json)
        price=json.data["amount"]
        console.log("coinbase",price)
        return [price];
    }
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }

}
async function cryptoCompareResponder(event) {
    // do stuff with these values
    const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    // var endpointParams=["BTC","USD"];
    try 
    {
        var cryptoCompareURL="https://min-api.cryptocompare.com/data/pricemulti?fsyms="+endpointParams[0].toUpperCase()+"&tsyms="+endpointParams[1].toUpperCase()
        const body = await requestPromise(cryptoCompareURL);
        const json = JSON.parse(body);
        var price;
        // console.log("cryptocompare",json[endpointParams[0].toUpperCase()],endpointParams[1].toUpperCase())
        // price=json[query]
        price=json[endpointParams[0].toUpperCase()][endpointParams[1].toUpperCase()]
        console.log("cryptocompare",price)
        return [price];
    }
    catch(error){
        return ["0"]
    }
}
async function bitfinexResponder(event) {
    // do stuff with these values
    const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    // var query=""
    // var endpointParams=["BTC","USD"];
    try  {
        var convert =endpointParams[0].toUpperCase()+endpointParams[1].toUpperCase()
        var bitfinexURL="https://api.bitfinex.com/v2/ticker/t"+convert
    
        const body = await requestPromise(bitfinexURL);
        const json = JSON.parse(body);
        var price;
        // console.log(json)
        price=json[6]// Last Price
        console.log("bitfinex",price)
        return [price];
    }
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }
}
async function poloniexResponder(event) {
    // do stuff with these values
    const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    // var query="USDT_ETH"
    // var endpointParams=["ETH", "USD"];
    try {
        var convert;
        if(endpointParams[1].toUpperCase()=="USD"){
            convert = "USDT_"+endpointParams[0].toUpperCase()
        }
        else{
            convert = endpointParams[1]+"_"+endpointParams[0].toUpperCase()
        }
        var poloniexURL="https://poloniex.com/public?command=returnTicker"
    
        const body = await requestPromise(poloniexURL);
        const json = JSON.parse(body);
        var price;
        // console.log(json[convert])
        price=json[convert]["last"]// Last Price
        console.log("poloniex", price)
        return [price];
    }
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }
}

async function lakeResponder(event) {
    // do stuff with these values
    const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    //  var query=""
    // var endpointParams=["btc","usd"];
    var convert =endpointParams[0].toLowerCase()+endpointParams[1].toLowerCase()

    try {var lakeURL="https://api.lakebtc.com/api_v2/ticker"
    
        const body = await requestPromise(lakeURL);
        const json = JSON.parse(body);
        var price;
        // console.log(json[convert])
        price=json[convert]["last"]// Last Price
        console.log("lake",price)
        return [price];
    }
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }
}
async function bitstampResponder(event) {
    // do stuff with these values
    const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    // var query=""
    // var endpointParams=["btc","usd"];
    var convert =endpointParams[0]+endpointParams[1]
    try{
        var bitstampURL="https://www.bitstamp.net/api/v2/ticker/"+convert
    
        const body = await requestPromise(bitstampURL);
        const json = JSON.parse(body);
        var price;
        // console.log(json)
        price=json["last"]// Last Price
        console.log("bitstamp",price)
        return [price];
    }
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }
}
async function coinMarketCapResponder(event) {
  /*
  *  Currently, the constant apiKey is Matt's personal free api key. 
  *  If this function gets rate limited, we need to obtain a paid subscription 
  *  and replace apiKey with one that will have higher rate limits.
  */
  const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
  try{ 
    const apiKey = '7cef5516-1592-4b03-9a30-0a9d8a693e2f';
    
    const symbol = endpointParams[0].toUpperCase();
    const convert = endpointParams[1].toUpperCase();
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=" + symbol + "&convert=" + convert;
  
    var body = await requestPromise(url, null, {'X-CMC_PRO_API_KEY' : apiKey});
    const json = JSON.parse(body);
    // console.log(json)
    // console.log("cmc",json["data"]["BTC"]["quote"]["USD"]["price"]);
    return [""+json["data"]["BTC"]["quote"]["USD"]["price"]];
    }
    catch(error){
        console.log("cmc fail")
        return ["0","Unable to Access data. Try again later"]
    }
}

async function coinDeskResponder(event) {
  const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
  const fiatCurrency = endpointParams[1].toUpperCase();
  if(endpointParams[0].toUpperCase()!="BTC"){
    console.log("BTC ONLY")
        return ["0","BTC Only. Try again."]
  }

  try{
    const url = "https://api.coindesk.com/v1/bpi/currentprice/"+fiatCurrency+".json";
    var body = await requestPromise(url);
    const json = JSON.parse(body);
    console.log("coindesk",json["bpi"][fiatCurrency]["rate_float"]);
    return [""+json["bpi"][fiatCurrency.toUpperCase()]["rate_float"]];
    }
  catch(error){
        console.log("coindesk fail")
        return ["0","Unable to Access data. Try again later"]
    }
}

async function krakenResponder(event) {
  const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
  var from = endpointParams[0].toUpperCase();
  var to = endpointParams[1].toUpperCase();

  if (from == "BTC") {
    from = "XBT";
  }

  if (to == "BTC") {
    to = "XBT";
  }
try {
      const pairSymbol = "X" + from + "Z" + to;
      const url = "https://api.kraken.com/0/public/Trades?pair=" + pairSymbol;

      var body = await requestPromise(url);
      const json = JSON.parse(body);

      var tradesArray = json["result"][pairSymbol];

      console.log("kraken",tradesArray[tradesArray.length - 1][0]);
      return ["" + tradesArray[tradesArray.length - 1][0]];
    }
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }
}

async function geminiResponder(event) {
  const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
  
  try{
    const pair = endpointParams[0] + endpointParams[1];
    const url = "https://api.gemini.com/v1/pubticker/" + pair;
  
    var body = await requestPromise(url);
    const json = JSON.parse(body);
  
    console.log("gemini", json["last"]);
    return [json["last"]];
    }
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }
}

// async function coinbaseResponder(event) {
//   const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
//   const pair = endpointParams[0] + "-" + endpointParams[1];
//   const url = "https://api.coinbase.com/v2/prices/" + pair + "/spot";

//   var body = await requestPromise(url);
//   const json = JSON.parse(body);

//   console.log(json["data"]["amount"]);
//   return [""+json["data"]["amount"]];
// }
exports.getResponse = getResponse;
exports.coinCapResponder = coinCapResponder;
exports.coinbaseResponder = coinbaseResponder;
exports.cryptoCompareResponder = cryptoCompareResponder;
exports.bitfinexResponder = bitfinexResponder;
exports.poloniexResponder = poloniexResponder;
exports.lakeResponder = lakeResponder;
exports.bitstampResponder = bitstampResponder;
exports.averageResponder = averageResponder;
exports.coinMarketCapResponder = coinMarketCapResponder;
exports.geminiResponder = geminiResponder;
exports.krakenResponder = krakenResponder;
exports.coinDeskResponder = coinDeskResponder;