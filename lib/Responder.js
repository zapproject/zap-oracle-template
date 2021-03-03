"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponse = void 0;
var Decimal = require('decimal.js');
let axios = require('axios');
let baseURL = "https://api.bittrex.com/api/v1.1/public/getticker?market=USD-";
async function getResponse(coin, params) {
    try {
        console.log(`fetching from ${baseURL}${coin.toUpperCase()}`);
        let data = await axios.get(`${baseURL}${coin.toUpperCase()}`);
        let price = data.data.result.Last;
        price = price.toString();
        console.log("data for coin", price[1]);
        if (params) {
            let s = params[0];
            if (s = "int") {
                let p = new Decimal(price);
                price = (p.times('10e+18').floor()).toNumber();
            }
        }
        return [price];
    }
    catch (e) {
        console.log("fetching failure");
        return [0]; //return 0 to indicate price info is not available
    }
}
exports.getResponse = getResponse;
