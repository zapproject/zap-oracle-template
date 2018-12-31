"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Responder_1 = require("./Responder");
exports.Endpoints = [
   
    {
        name: "PoloniexAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.poloniexResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.poloniexResponder
            }]
    }
    //response format  options  are reponse methods :respondBytes32Array, respondIntArray, respond1, respond2, respond3, respond4
];
