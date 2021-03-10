"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectStatus = exports.updateStatus = void 0;
const io = require("socket.io-client");
const axios = require("axios");
const ZAP_SERVER = "http://localhost:8000";
const updateStatus = function (web3, oracle, endpoint) {
    update(web3, oracle, endpoint);
    setInterval(() => {
        update(web3, oracle, endpoint);
    }, 3 * 60 * 1000); //every  minutes
};
exports.updateStatus = updateStatus;
async function update(web3, oracle, endpoint) {
    console.log("update status");
    try {
        let time = new Date().getTime();
        const data = endpoint + ":" + time;
        console.log(data);
        let signature = await web3.eth.sign(data, oracle);
        let options = {
            method: "POST",
            uri: ZAP_SERVER + "/update",
            body: {
                data,
                signature
            },
            json: true
        };
        const result = await axios(options);
        console.log(result);
    }
    catch (e) {
        console.error(e);
    }
}
const connectStatus = async (web3, endpoint) => {
    let accounts = await web3.eth.getAccounts();
    let oracle = accounts[0];
    console.log(oracle);
    let socket = io(ZAP_SERVER, { path: "/ws/", secure: true });
    socket.on("connect", async () => {
        const signature = await web3.eth.sign(endpoint, oracle);
        console.log(signature);
        socket.emit("authentication", { endpoint: "TrendSignals", signature });
    });
    socket.on("authenticated", () => {
        console.log("authenticated");
    });
    socket.on("unauthorized", () => {
        console.log("unauthorized");
    });
};
exports.connectStatus = connectStatus;
