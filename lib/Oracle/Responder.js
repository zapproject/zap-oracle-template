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
    // Also see ORacle.ts line 213
    try {
        var coincapURL = "https://api.coincap.io/v2/assets/" + endpointParams[0].toLowerCase();
        // Generate the URL to fetch the JSON from coincap website. Finds the information using the first parameter
        const body = await requestPromise(coincapURL);
        // Make a get request to the generated URL to fetch the JSON
        const json = JSON.parse(body);
        // Formate the JSON to be more accesible
        var price;
        // Initialize the return value as either a string or an integer
        price = json["data"]["priceUsd"];
        if (endpointParams[1]) {
            // If a precision is added, multiplies the price by 10^precision and returns the answer as an integer
            var precision = parseInt(endpointParams[1]);
            price = (price) * (10 ** precision);
            console.log("coincap", Math.floor(price));
            return [Math.floor(price)];
        }
        else {
            // Otherwise returns the price as a string
            console.log("coincap", price);
            return ["" + price];
        }
    }
    catch (error) {
        // If an error is encountered, returns an error message
        return ["0", "Unable to Access data. Try again later"];
    }
}
exports.coincapResponder = coincapResponder;
