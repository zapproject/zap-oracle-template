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
    }
];
