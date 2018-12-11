"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Responder_1 = require("./Responder");
exports.Endpoints = [
    {
        name: "DaveBTC",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "average",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.averageResponder
            }]
    },
    {
        name: "CoinCapAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.coinCapResponder
            }]
    },
    {
        name: "CoinBaseAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.coinBaseResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.coinBaseResponder
            }]
    },
    {
        name: "CryptoCompareAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.cryptoCompareResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                getResponse: Responder_1.cryptoCompareResponder
            }]
    },
    {
        name: "BitFinexAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.bitFinexResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.bitFinexResponder
            }]
    },
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
    },
    {
        name: "LakeBTCAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.lakeResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.lakeResponder
            }]
    },
    {
        name: "BitStampAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.bitStampResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.bitStampResponder
            }]
    },
    {
        name: "KrakenAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                getResponse: Responder_1.bitStampResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.bitStampResponder
            }]
    },
    {
        name: "GeminiAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.bitStampResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                getResponse: Responder_1.bitStampResponder
            }]
    },
    {
        name: "CoinDeskAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                getResponse: Responder_1.bitStampResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.bitStampResponder
            }]
    },
    {
        name: "CoinMarketCapAPI",
        curve: [1,1e18,1e18],
        broker: "",
        md: "",
        queryList: [{
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.bitStampResponder
            },
            {
                query: "price",
                params: ["{from}","{to}"],
                response: ["{price}"],
                dynamic:false,
                getResponse: Responder_1.bitStampResponder
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
