"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Responder_1 = require("./Responder");
exports.Endpoints = [
    {
        name: "CoinCapV2",
        curve: [1, 1, 10000000000],
        broker: "",
        md: "",
        queryList: [{
                query: "toUSD",
                params: ["from", "precision"],
                response: ["result"],
                dynamic: false,
                getResponse: Responder_1.coincapResponder
            }]
    }
];
