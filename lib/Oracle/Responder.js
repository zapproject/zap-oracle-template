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
exports.poloniexResponder = poloniexResponder;
