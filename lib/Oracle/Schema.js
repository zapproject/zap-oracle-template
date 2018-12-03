"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Responder_1 = require("./Responder");
exports.Endpoints = [
    {
        name: "AddSub",
        curve: [1,10000,10000],
        queryList: [{
                query: "Addition",
                params: ["{addend1}","{addend2}"],
                response: ["{sum}"],
                dynamic: false,
                getResponse: Responder_1.add
            },
            {
                query: "Subtraction",
                params: ["{Minuend}", "{Subtrahend}"],
                response: ["{Difference}"],
                dynamic: false,
                getResponse: Responder_1.subtract
            }]
    }
    //response format  options  are reponse methods :
    // dynamic:true  --- respondBytes32Array, respondIntArray,
    // dynamic:false  --- respond1, respond2, respond3, respond4
];
/**
 * Example for Endpoint Schema
 {
        name: "CoinBaseSource",
        curve :[1,1,1e18],
        queryList: [{
            query:"price",
            params:["{coin}","{time}"],
            response: ["{price}","{notaryHash}"],
            getResponse: getResponse
        },
            {
                query:"volume",
                params:["{coin}","{period}"],
                response: ["{volume}","{notaryHash}"],
                getResponse: getResponse
            }]
    }
 */
