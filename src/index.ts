//import { loadProvider, createProvider, createProviderCurve, getEndpointInfo, doBondage, doUnbondage } from "./provider";
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const Web3 = require('web3');

import { ZapRegistry } from "@zapjs/registry";
import { ZapProvider } from "@zapjs/provider";
import { initProvider, createProvider } from "./providerFactory";
import { responders } from "./provider";
import { parseEvent, ZapQueryEvent, ZapResponder } from "./utils";

const INFURA_WS = "wss://kovan.infura.io/ws/xeb916AFjrcttuQlezyq";

const mnemonic: string = "rally later assist feature wait primary addict sister remove language piece drink";

/**
 * Handles a query
 * @param writer - HTTP Web3 instance to respond to query with
 * @param queryEvent - Web3 incoming query event
 * @returns ZapProvider instantiated
 */
export async function handleQuery(provider: ZapProvider, queryEvent: any): Promise<void> {
	const web3 = provider.zapBondage.web3;

	// Parse the event into usable variables
	const event: ZapQueryEvent = parseEvent(web3, queryEvent.returnValues);

	if ( !(event.endpoint in responders) ) {
		console.log('Unable to find the responder for', event.endpoint);
		return;
	}

	// Call the callback
	const response: string[] = await responders[event.queryId](web3, event);

	// Send the response
	provider.zapDispatch.respond({
		queryId: event.queryId,
		responseParams: response,
		from: provider.providerOwner,
		dynamic: true
	}).then((txid: any) => { 
		console.log('Responsed to', event.subscriber, "in transaction", txid.transactionHash);
	});
}

async function main() {
	const web3: any = new Web3(new HDWalletProviderMem(mnemonic, INFURA_WS));

	// Get the provider and contracts
	const { provider, contracts } = await initProvider(web3);

	const registry: ZapRegistry = provider.zapRegistry;
	const title = await registry.getProviderTitle(provider.providerOwner);

	if ( title.length == 0 ) {
		console.log("Initializing provider");
		createProvider(provider);
	}
	else {
		console.log("Oracle already exists. Listening for queries");
		
		// TODO make endpoint specific
		provider.listenQueries({}, (err: any, event: any) => { 
			if ( err ) {
				throw err;
			}

			handleQuery(provider, event);
		});
	}
}

main();