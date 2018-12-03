"use strict";
//==============================================================================================================
// Dependencies
//==============================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const Web3 = require('web3');
const provider_1 = require("@zapjs/provider");
const zaptoken_1 = require("@zapjs/zaptoken");
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const Schema_1 = require("./Schema");
const { toBN } = require("web3-utils");
const assert = require("assert");
class Oracle {
    constructor() {
        /**
         * Loads a ZapProvider from a given Web3 instance
         * @param web3 - WebSocket Web3 instance to load from
         * @returns ZapProvider instantiated
         */
        this.delay = (ms) => new Promise(_ => setTimeout(_, ms));
        this.web3 = new Web3(new HDWalletProviderMem(Config_1.Config.mnemonic, Config_1.Config.NODE_WS));
    }
    async getWeb3Provider() {
        return new HDWalletProviderMem(Config_1.Config.mnemonic, Config_1.Config.NODE_WS);
    }
    //==============================================================================================================
    // Setup Functions
    //==============================================================================================================
    validateSchema() {
        for (let endpoint of Schema_1.Endpoints) {
            assert(endpoint.name, "Endpoint's name is required");
            assert(endpoint.curve, `Curve is required for endpoint ${endpoint.name}`);
            assert(endpoint.curve.length >= 3, `Curve's length is invalid for endpoint ${endpoint.name}`);
            assert(endpoint.queryList && endpoint.queryList.length >= 1, `query list is required for data offer`);
        }
    }
    getQueryList(endpointName) {
        for (let endpoint of Schema_1.Endpoints) {
            if (endpoint.name == endpointName.toLowerCase()) {
                return endpoint.queryList;
            }
        }
        return [];
    }
    getEndpoints() {
        return Schema_1.Endpoints;
    }
    async delegateBond(subscriber, dots) {
        let provider = await this.getProvider();
        let zapToken = new zaptoken_1.ZapToken({ networkId: await this.web3.eth.net.getId(), networkProvider: this.web3 });
        for (let endpoint of Schema_1.Endpoints) {
            let approve = await zapToken.approve({ to: provider.zapBondage.contract._address, from: provider.providerOwner, amount: '100000000000' });
            await provider.zapBondage.delegateBond({ provider: provider.providerOwner, endpoint: endpoint.name, subscriber, dots, from: provider.providerOwner });
        }
    }
    /**
     * Initializes the oracle. Creates the provider if it does not exist already.
     * For each endpoint in schema, create curve and params
     * Starts listening for queries and calling handleQuery function
     */
    async initialize() {
        await this.validateSchema();
        const web3 = new Web3(await this.getWeb3Provider());
        // Get the provider and contracts
        const provider = await this.getProvider();
        await this.delay(5000);
        const title = await provider.getTitle();
        if (title.length == 0) {
            console.log("No provider found, Initializing provider");
            const res = await provider.initiateProvider({ title: Config_1.Config.title, public_key: Config_1.Config.public_key });
            console.log(res);
            console.log("Successfully created oracle", Config_1.Config.title);
        }
        else {
            console.log("Oracle exists");
        }
        //Create endpoints if not exists
        for (let endpoint of Schema_1.Endpoints) {
            let curveSet = await provider.isEndpointCreated(endpoint.name);
            if (!curveSet) {
                //create endpoint
                console.log("create endpoint");
                const createEndpoint = await provider.initiateProviderCurve({ endpoint: endpoint.name, term: endpoint.curve, broker: "0x0000000000000000000000000000000000000000" });
                console.log("Successfully created endpoint ", createEndpoint);
            }
            else {
                console.log("curve is set : ", await provider.getCurve(endpoint.name));
            }
            //Right now each endpoint can only store 1 set of params, so not storing params for more flexibility
            // else {
            //     //check params
            //     let params = await provider.getEndpointParams(endpoint.name)
            //     if (params.length == 0 && endpoint.params.length > 1) {
            //         await provider.setEndpointParams({endpoint: endpoint.name, params: endpoint.params}) //todo zapjs needs to implement this
            //     }
            // }
            provider.listenQueries({}, (err, event) => {
                if (err) {
                    throw err;
                }
                this.handleQuery(provider, endpoint, event, web3);
            });
        }
    }
    async getProvider() {
        // loads the first account for this web3 provider
        const accounts = await this.web3.eth.getAccounts();
        if (accounts.length == 0)
            throw ('Unable to find an account in the current web3 provider');
        const owner = accounts[0];
        console.log("Loaded account:", owner);
        // TODO: Add Zap balance
        console.log("Wallet contains:", await this.web3.eth.getBalance(owner) / 1e18, "ETH");
        return new provider_1.ZapProvider(owner, {
            networkId: (await this.web3.eth.net.getId()).toString(),
            networkProvider: this.web3.currentProvider
        });
    }
    //==============================================================================================================
    // Query Handler
    //==============================================================================================================
    /**
     * Handles a query
     * @param writer - HTTP Web3 instance to respond to query with
     * @param queryEvent - Web3 incoming query event
     * @returns ZapProvider instantiated
     */
    async handleQuery(provider, endpoint, queryEvent, web3) {
        const results = queryEvent.returnValues;
        let response;
        // Parse the event into a usable JS object
        const event = {
            queryId: results.id,
            query: results.query,
            endpoint: web3.utils.hexToUtf8(results.endpoint),
            subscriber: results.subscriber,
            endpointParams: results.endpointParams.map(web3.utils.hexToUtf8),
            onchainSub: results.onchainSubscriber
        };
        if (event.endpoint != endpoint.name) {
            console.log('Unable to find the callback for', event.endpoint);
            return;
        }
        console.log(`Received query to ${event.endpoint} from ${event.onchainSub ? 'contract' : 'offchain subscriber'} at address ${event.subscriber}`);
        console.log(`Query ID ${event.queryId.substring(0, 8)}...: "${event.query}". Parameters: ${event.endpointParams}`);
        for (let query of endpoint.queryList) {
            // Call the responder callback
            response = await query.getResponse(event);
            // Send the response
            let res = await provider.respond({
                queryId: event.queryId,
                responseParams: response,
                dynamic: query.dynamic
            }).then((txid) => {
                console.log('Responded to', event.subscriber, "in transaction", txid.transactionHash);
            }).catch((e) => {
                console.error(e);
                throw new Error(`Error responding to query ${event.queryId} : ${e}`);
            });
        }
    }
}
exports.Oracle = Oracle;
