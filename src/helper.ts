//==============================================================================================================
// Dependencies
//==============================================================================================================

const Web3 = require('web3');
const request = require('request');

import { ZapProvider } from "@zapjs/provider";
import { getWeb3Provider, Responders, ProviderData } from "./provider";
import { join } from "path";

//==============================================================================================================
// Types
//==============================================================================================================

export type ZapQueryEvent = {
	queryId: string;
	query: string;
	endpoint: string;
	subscriber: string;
	endpointParams: string[];
	onchainSub: boolean;
};

export type ZapResponderFunction = (web3: any, event: ZapQueryEvent) => Promise<string[]>;

export type ZapResponder = {
	[name: string]: {
		responder: ZapResponderFunction,
		curve: number[]
	};
}


//==============================================================================================================
// Setup Functions
//==============================================================================================================

/**
 * Initializes the oracle. Creates the provider if it does not exist already. Starts listening
 * for queries if it does.
 */
 export async function initialize() {
 	const web3: any = new Web3(await getWeb3Provider());

	// Get the provider and contracts
	const provider = await initProvider(web3);

	const title = await provider.getTitle();

	if ( title.length == 0 ) {
		console.log("Initializing provider");
		
		await provider.initiateProvider(ProviderData);
		
		for ( const responder in Responders ) {
			await provider.initiateProviderCurve({
				endpoint: responder,
				term: Responders[responder].curve,
				from: provider.providerOwner
			});
		}
	}
	else {
		console.log("Oracle already exists. Listening for queries");
		
		provider.listenQueries({}, (err: any, event: any) => { 
			if ( err ) {
				throw err;
			}

			handleQuery(provider, event);
		});
	}
}

/**
 * Loads a ZapProvider from a given Web3 instance
 * @param web3 - WebSocket Web3 instance to load from
 * @returns ZapProvider instantiated
 */
 export async function initProvider(web3: any): Promise<ZapProvider> {
 	// loads the first account for this web3 provider
 	const accounts: string[] = await web3.eth.getAccounts();
 	if ( accounts.length == 0 ) throw('Unable to find an account in the current web3 provider');

 	console.log("Loaded account:", owner);
 	// TODO: Add Zap balance
 	console.log("Wallet contains:", await web3.eth.getBalance(owner) / 1e18, "ETH");

 	return new ZapProvider(owner, {
 		artifactsDir: join(__dirname, '../', 'node_modules/@zapjs/artifacts/contracts/'),
 		networkId: (await web3.eth.net.getId()).toString(),
 		networkProvider: web3.currentProvider,
 	});


//==============================================================================================================
// Query Handler
//==============================================================================================================

/**
 * Handles a query
 * @param writer - HTTP Web3 instance to respond to query with
 * @param queryEvent - Web3 incoming query event
 * @returns ZapProvider instantiated
 */
 export async function handleQuery(provider: ZapProvider, queryEvent: any): Promise<void> {
 	const web3 = provider.zapBondage.web3;

 	const results:any = queryEvent.returnValues;

	// Parse the event into a usable JS object
	const event: ZapQueryEvent = {
		queryId: results.id,
		query: results.query,
		endpoint: web3.utils.hexToUtf8(results.endpoint),
		subscriber: results.subscriber,
		endpointParams: results.endpointParams.map(web3.utils.hexToUtf8),
		onchainSub: results.onchainSubscriber
	}

	if ( !(event.endpoint in Responders) ) {
		console.log('Unable to find the responder for', event.endpoint);
		return;
	}

	console.log(`Received query to ${event.endpoint} from ${event.onchainSub ? 'contract' : 'offchain subscriber'} at address ${event.subscriber}`);
	console.log(`Query ${event.queryId.substring(0, 8)}...: "${event.query}". Parameters: ${event.endpointParams}`);

	// Call the responder callback
	const response: string[] = await Responders[event.endpoint].responder(web3, event);

	// Send the response
	provider.respond({
		queryId: event.queryId,
		responseParams: response,
		dynamic: true
	}).then((txid: any) => { 
		console.log('Responsed to', event.subscriber, "in transaction", txid.transactionHash);
	});
}


//==============================================================================================================
// Additional Helper Functions
//==============================================================================================================

/**
 * Performs a GET request on an API url and eventually returns the JSON response 
 * 
 * @param url - HTTP/HTTPS url to query from
 * @returns A Promise that eventually resolves into JSON data returned from the server
 */
 export function requestPromise(url: string): Promise<any> {
 	return new Promise((resolve, reject) => {
 		request.get(url, function (err: any, response: any, data: any) { 
 			if ( err ) {
 				reject(err);
 				return;
 			}
 			resolve(data);
 		});
 	});
 }



