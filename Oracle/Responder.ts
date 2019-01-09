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
    
    try{
    var coincapURL:string="http://coincap.io/page/"+endpointParams[0].toUpperCase();
    const body:any = await requestPromise(coincapURL);
    const json:any = JSON.parse(body);
    var price:string;
    
    var convert:string = "price_"+endpointParams[1].toLowerCase();
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
