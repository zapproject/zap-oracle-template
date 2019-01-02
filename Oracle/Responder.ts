import {QueryEvent} from "./types";
const request = require('request');

function requestPromise(url:string, method:string = "GET", headers:number = -1, data:number = -1) {
    var trans:any = {
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
        request(trans, (err:any, response:any, data:any) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

export async function poloniexResponder(event:QueryEvent){
	// do stuff with these values
    const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    // var query="USDT_ETH"
    // var endpointParams=["ETH", "USD"];
    try {
        var convert:string;
        if(endpointParams[1].toUpperCase()=="USD"){
            convert = "USDT_"+endpointParams[0].toUpperCase()
        }
        else{
            convert = endpointParams[1].toUpperCase()+"_"+endpointParams[0].toUpperCase()
            console.log(convert)
        }
        var poloniexURL:string="https://poloniex.com/public?command=returnTicker"
    
        const body:any = await requestPromise(poloniexURL);
        const json:any = JSON.parse(body);
        var price:string;
        // console.log(json[convert])
        price=json[convert]["last"]// Last Price
        console.log("poloniex", price)
        return [price];
    }
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }
}
