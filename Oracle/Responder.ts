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

export async function coincapResponder(event:QueryEvent){
	const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    // Also see ORacle.ts line 213
    try{
    var coincapURL:string="http://coincap.io/page/"+endpointParams[0].toUpperCase();
    // Generate the URL to fetch the JSON from coincap website. Finds the information using the first parameter
    const body:any = await requestPromise(coincapURL);
    // Make a get request to the generated URL to fetch the JSON
    const json:any = JSON.parse(body);
    // Formate the JSON to be more accesible
    var price:any;
    // Initialize the return value as either a string or an integer
    var convert:string = "price_"+endpointParams[1].toLowerCase();
    // 
    if(json[convert])//If the conversion exists, return the exchange rate.
        price=json[convert]
    else//if the conversion doesnt exist, return the price of the unit in ether.
        price=json["price_eth"]
    console.log("coincap",price)
    if(endpointParams[2]){
        // If a precision is added, multiplies the price by 10^precision and returns the answer as an integer
        var precision:number = parseInt(endpointParams[2])
        price = (price)*(10**precision)
        return[Math.floor(price)]
    }
    else{
        // Otherwise returns the price as a string
        return [""+price];
    }
    }
    catch(error){
        // If an error is encountered, returns an error message
        return ["0","Unable to Access data. Try again later"]
    }
}
