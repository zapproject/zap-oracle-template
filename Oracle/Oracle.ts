//==============================================================================================================
// Dependencies
//==============================================================================================================

import {Config} from "./Config";
const Web3 = require('web3');
import { ZapProvider } from "@zapjs/provider";
import {ZapToken} from "@zapjs/zaptoken"
const HDWalletProviderMem = require("truffle-hdwallet-provider");
import {Endpoints} from "./Schema";
const {toBN} =require("web3-utils");
const assert = require("assert")
import {EndpointSchema, QueryEvent} from "./types";


export  class Oracle {
    web3:any
    constructor(){
        this.web3 = new Web3(new HDWalletProviderMem(Config.mnemonic, Config.NODE_WS))
    }

    async getWeb3Provider() {
        return new HDWalletProviderMem(Config.mnemonic, Config.NODE_WS);
    }

//==============================================================================================================
// Setup Functions
//==============================================================================================================




    validateSchema() {
        for (let endpoint of Endpoints) {
            assert(endpoint.name, "Endpoint's name is required")
            assert(endpoint.curve, `Curve is required for endpoint ${endpoint.name}`)
            assert(endpoint.curve.length >= 3, `Curve's length is invalid for endpoint ${endpoint.name}`)
            assert(endpoint.queryList && endpoint.queryList.length > 1, `query list is required for data offer`)
        }
    }


    getQueryList(endpointName:string){
        for(let endpoint of Endpoints){
            if (endpoint.name == endpointName.toLowerCase()){
                return endpoint.queryList
            }
        }
        return []
    }

    getEndpoints(){
        return Endpoints
    }

    async delegateBond(subscriber:string,dots:number){
        let provider = await this.getProvider()
        let zapToken = new ZapToken({networkId: this.web3.eth.net.getId(), networkProvider: this.web3})
        for(let endpoint of Endpoints) {
            await zapToken.approve({to:provider.zapBondage.contract.address,from:provider.providerOwner,amount:toBN(1e10)})
            await provider.zapBondage.delegateBond({provider: provider.providerOwner, endpoint: endpoint.name,subscriber,dots,from:provider.providerOwner})
        }
    }

    /**
     * Initializes the oracle. Creates the provider if it does not exist already.
     * For each endpoint in schema, create curve and params
     * Starts listening for queries and calling handleQuery function
     */
    async initialize() {
        await
            this.validateSchema()
        const web3: any = new Web3(await this.getWeb3Provider());
        // Get the provider and contracts
        const provider = await this.getProvider();
        const title = await
            provider.getTitle();
        if (title.length == 0) {
            console.log("No provider found, Initializing provider");
            const res: string = await
                provider.initiateProvider({title: Config.title, public_key: Config.public_key});
            console.log(res);
            console.log("Successfully created oracle", Config.title);
        }
        else {
            console.log("Oracle exists");
        }
        //Create endpoints if not exists
        for (let endpoint of Endpoints) {
            let curveSet = await
                provider.isEndpointCreated(endpoint.name)
            if (!curveSet) {
                //create endpoint
                console.log("create endpoint")
                const createEndpoint = await
                    provider.initiateProviderCurve({endpoint: endpoint.name, term: endpoint.curve});
                console.log("Successfully created endpoint ", createEndpoint)
            }
            else {
                console.log("curve is set : ", await
                    provider.getCurve(endpoint.name)
                )
            }
            //Right now each endpoint can only store 1 set of params, so not storing params for more flexibility
            // else {
            //     //check params
            //     let params = await provider.getEndpointParams(endpoint.name)
            //     if (params.length == 0 && endpoint.params.length > 1) {
            //         await provider.setEndpointParams({endpoint: endpoint.name, params: endpoint.params}) //todo zapjs needs to implement this
            //     }
            // }

            provider.listenQueries({}, (err: any, event: any) => {
                if (err) {
                    throw err;
                }

                this.handleQuery(provider, endpoint, event, web3);
            });
        }
    }

    /**
     * Loads a ZapProvider from a given Web3 instance
     * @param web3 - WebSocket Web3 instance to load from
     * @returns ZapProvider instantiated
     */


    async getProvider(): Promise<ZapProvider> {
        // loads the first account for this web3 provider
        const accounts: string[] = await this.web3.eth.getAccounts();
        if (accounts.length == 0) throw('Unable to find an account in the current web3 provider');
        const owner: string = accounts[0];
        console.log("Loaded account:", owner);
        // TODO: Add Zap balance
        console.log("Wallet contains:", await this.web3.eth.getBalance(owner) / 1e18, "ETH");
        return new ZapProvider(owner, {
            networkId: (await this.web3.eth.net.getId()).toString(),
            networkProvider:this.web3.currentProvider});
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


    async handleQuery(provider: ZapProvider, endpoint: EndpointSchema, queryEvent: any, web3: any): Promise<void> {
        const results: any = queryEvent.returnValues;
        let response: string[] | number[]
        // Parse the event into a usable JS object
        const event: QueryEvent = {
            queryId: results.id,
            query: results.query,
            endpoint: web3.utils.hexToUtf8(results.endpoint),
            subscriber: results.subscriber,
            endpointParams: results.endpointParams.map(web3.utils.hexToUtf8),
            onchainSub: results.onchainSubscriber
        }
        if (event.endpoint != endpoint.name) {
            console.log('Unable to find the callback for', event.endpoint);
            return;
        }

        console.log(`Received query to ${event.endpoint} from ${event.onchainSub ? 'contract' : 'offchain subscriber'} at address ${event.subscriber}`);
        console.log(`Query ID ${event.queryId.substring(0, 8)}...: "${event.query}". Parameters: ${event.endpointParams}`);
        for (let query of endpoint.queryList) {
            // Call the responder callback
            response = await
                query.getResponse(event)
            // Send the response
            provider.respond({
                queryId: event.queryId,
                responseParams: response,
                dynamic: false
            }).then((txid: any) => {
                console.log('Responded to', event.subscriber, "in transaction", txid.transactionHash);
            }).catch((e) => {
                console.error(e)
                throw new Error(`Error responding to query ${event.queryId} : ${e}`)
            })
        }
    }
}



