"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Oracle_1 = require("../Oracle/Oracle");
const subscriber_1 = require("@zapjs/subscriber");
const Config_1 = require("../Oracle/Config");
const Web3 = require('web3');
const HDWalletProviderMem = require("truffle-hdwallet-provider");
async function queryProvider(providerAddress) {
    const oracle = new Oracle_1.Oracle();
    //setup subscriber, for demo reason, we use same wallet as provider's
    let web3 = new Web3(new HDWalletProviderMem(Config_1.Config.mnemonic, Config_1.Config.NODE_WS, 1));
    let accounts = await web3.eth.getAccounts();
    let subcriberOwner = accounts[0];
    let zapSubscriber = new subscriber_1.ZapSubscriber(subcriberOwner, { networkProvider: web3, networkId: await web3.eth.net.getId() });
    await oracle.delegateBond(subcriberOwner, 100);
    //start listening to incoming reponses
    zapSubscriber.listenToOffchainResponse({}, (err, logs) => {
        console.log("Response event from provider : ", logs);
    });
    //Get Oracle query list and query
    let endpoints = oracle.getEndpoints();
    endpoints.map((endpoint) => {
        console.log(zapSubscriber.zapBondage.contract.options.address);
        endpoint.queryList.map((query) => {
            zapSubscriber.queryData({
                provider: providerAddress,
                query: query.query,
                endpoint: endpoint.name,
                endpointParams: query.params.slice(0),
                gas: 300000
            })
                .then(console.log)
                .catch(console.error);
        });
    });
}
exports.queryProvider = queryProvider;
