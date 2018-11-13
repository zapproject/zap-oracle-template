"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Responder_1 = require("./Responder");
exports.Endpoints = [
    {
        name: "",
        curve: [],
        queryList: [{
                query: "",
                params: [],
                response: [],
                dynamic: true,
                getResponse: Responder_1.getResponse
            },
            {
                query: "",
                params: [],
                response: [],
                dynamic: true,
                getResponse: Responder_1.getResponse
            }]
    }
    //response format  options  are reponse methods :respondBytes32Array, respondIntArray, respond1, respond2, respond3, respond4
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
