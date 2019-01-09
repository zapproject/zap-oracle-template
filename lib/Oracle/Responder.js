"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
async function coincapResponder(event) {
    const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
    try {
        var coincapURL = "http://coincap.io/page/" + endpointParams[0].toUpperCase();
        const body = await requestPromise(coincapURL);
        const json = JSON.parse(body);
        var price;
        var convert = "price_" + endpointParams[1].toLowerCase();
        if (json[convert])
            price = json[convert];
        else
            price = json["price_eth"];
        console.log("coincap", price);
        return ["" + price];
    }
    catch (error) {
        return ["0", "Unable to Access data. Try again later"];
    }
}
exports.coincapResponder = coincapResponder;
