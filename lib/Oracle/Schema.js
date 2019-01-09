"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Responder_1 = require("./Responder");
exports.Endpoints = [
    {
        name: "CoinCapAPI",
        curve: [2, 7e18, 1e16, 10000000000],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["from", "to"],
                response: ["price"],
                dynamic: false,
                getResponse: Responder_1.coincapResponder
            }]
        // },
        //     {
        //         query:"",
        //         params:[],
        //         response: [],
        //         dynamic:true,
        //         getResponse: getResponse
        //     }]
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
