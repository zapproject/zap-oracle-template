//==============================================================================================================
// Dependencies
//==============================================================================================================

import {Config} from "./Config";
const Web3 = require('web3');
const request = require('request');
import { ZapProvider } from "@zapjs/provider";
const HDWalletProviderMem = require("truffle-hdwallet-provider");
import {Endpoints} from "./Schema";
const assert = require("assert")
import {EndpointSchema, QueryEvent} from "./types";

export async function getWeb3Provider() {
    return new HDWalletProviderMem(Config.mnemonic, Config.NODE_WS);
}

//==============================================================================================================
// Setup Functions
//==============================================================================================================


export async function validateSchema(){
    for(let endpoint of Endpoints){
        assert(endpoint.name,"Endpoint's name is required")
        assert(endpoint.curve,`Curve is required for endpoint ${endpoint.name}`)
        assert(endpoint.curve.length>3, `Curve's length is invalid for endpoint ${endpoint.name}`)
        assert(endpoint.params && endpoint.params.length>1,`Endpoint params is required to define response method`)
    }
}
/**
 * Initializes the oracle. Creates the provider if it does not exist already.
 * For each endpoint in schema, create curve and params
 * Starts listening for queries and calling handleQuery function
 */
 export async function initialize() {
    await validateSchema()
    const web3: any = new Web3(await getWeb3Provider());
    // Get the provider and contracts
    const provider = await getProvider(web3);
    const title = await provider.getTitle();
    if (title.length == 0) {
        console.log("No provider found, Initializing provider");
        const res: string = await provider.initiateProvider({title: Config.title, public_key: Config.public_key});
        console.log(res);
        console.log("Successfully created oracle", Config.title);
    }
    else {
        console.log("Oracle exists");
    }
    //Create endpoints if not exists
    for (let endpoint of Endpoints) {
        let curveSet = await provider.isEndpointCreated(endpoint.name)
        if (!curveSet) {
            //create endpoint
            await provider.initiateProviderCurve({endpoint: endpoint.name, term: endpoint.curve});
        }
        else {
            //check params
            let params = await provider.getEndpointParams(endpoint.name)
            if (params.length == 0 && endpoint.params.length > 1) {
                await provider.setEndpointParams({endpoint: endpoint.name, params: endpoint.params}) //todo zapjs needs to implement this
            }
        }

        provider.listenQueries({}, (err: any, event: any) => {
            if (err) {
                throw err;
            }

            handleQuery(provider,endpoint, event, web3);
        });
    }
}

/**
 * Loads a ZapProvider from a given Web3 instance
 * @param web3 - WebSocket Web3 instance to load from
 * @returns ZapProvider instantiated
 */
 export async function getProvider(web3: any): Promise<ZapProvider> {
 	// loads the first account for this web3 provider
 	const accounts: string[] = await web3.eth.getAccounts();
 	if ( accounts.length == 0 ) throw('Unable to find an account in the current web3 provider');
 	const owner: string = accounts[0];
 	console.log("Loaded account:", owner);
 	// TODO: Add Zap balance
 	console.log("Wallet contains:", await web3.eth.getBalance(owner) / 1e18, "ETH");

 	return new ZapProvider(owner, {
 		networkId: (await web3.eth.net.getId()).toString(),
 		networkProvider: web3.currentProvider,
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
 export async function handleQuery(provider: ZapProvider,endpoint:EndpointSchema, queryEvent: any, web3:any): Promise<void> {
 	const results:any = queryEvent.returnValues;

	// Parse the event into a usable JS object
	const event: QueryEvent = {
		queryId: results.id,
		query: results.query,
		endpoint: web3.utils.hexToUtf8(results.endpoint),
		subscriber: results.subscriber,
		endpointParams: results.endpointParams.map(web3.utils.hexToUtf8),
		onchainSub: results.onchainSubscriber
	}

	if ( event.endpoint != endpoint.name ) {
		console.log('Unable to find the callback for', event.endpoint);
		return;
	}

	console.log(`Received query to ${event.endpoint} from ${event.onchainSub ? 'contract' : 'offchain subscriber'} at address ${event.subscriber}`);
	console.log(`Query ID ${event.queryId.substring(0, 8)}...: "${event.query}". Parameters: ${event.endpointParams}`);

	// Call the responder callback
	const response: Array<string|number> = await endpoint.getResponse(event)

	// Send the response
	provider.respond({
		queryId: event.queryId,
		responseParams: response,
		dynamic: false
	}).then((txid: any) => { 
		console.log('Responded to', event.subscriber, "in transaction", txid.transactionHash);
	}).catch((e)=>{
	    console.error(e)
        throw new Error(`Error responding to query ${event.queryId} : ${e}`)
    })
}



/* Starts the oracle. Creates it (if it does not exist), and starts listening for queries */
initialize().catch((err:any) => console.error('zap-oracle-template error:', err));

