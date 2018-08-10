import { ZapArbiter } from "@zapjs/arbiter";
import { ZapBondage } from "@zapjs/bondage";
import { ZapDispatch } from "@zapjs/dispatch";
import { ZapRegistry } from "@zapjs/registry";
import { ZapProvider } from "@zapjs/provider";
import { ZapToken } from "@zapjs/zaptoken";

import { join } from "path";
const request = require('request');

/**
 * Promise that is resolved after a certain timeout
 *
 * @param timeout - Amount of ms to wait
 */
export function sleep(timeout: number): Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, timeout);
	})
}

/**
 * Loads the contracts from a specially formatted file
 *
 * @param web3 - Web3 instance to be used
 * @param file - The file containing the artifacts directory and addresses
 * @returns The loaded objects in a JSON formatted instance
 */
export async function loadContracts(web3: any): Promise<any> {
	const options: any = {
		artifactsDir: join(__dirname, '../', 'node_modules/@zapjs/artifacts/contracts/'),
		networkId: await web3.eth.net.getId(),
		networkProvider: web3.currentProvider,
	};
	
	return {
		'zapArbiter': new ZapArbiter(options),
		'zapBondage': new ZapBondage(options),
		'zapDispatch': new ZapDispatch(options),
		'zapRegistry': new ZapRegistry(options),
		'zapToken': new ZapToken(options)
	};
}

/**
 * Loads the first account from the current loaded provider in a web3 instance
 * 
 * @param web3 - Web3 instance to load accounts from
 * @returns The first account found
 */
export async function loadAccount(web3: any): Promise<string> {
	const accounts: string[] = await web3.eth.getAccounts();

	if ( accounts.length == 0 ) {
		console.log('Unable to find an account in the current web3 provider');
		process.exit(1);
		return "";
	}

	return accounts[0];
}


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
	[name: string]: ZapResponderFunction;
}

/**
 * Parses the output of the event to a usable JSON encoded object
 *
 * @param returnValues The returnValues field in the object
 * @returns The JSON encoded object
 */
export function parseEvent(web3: any, results: any): ZapQueryEvent {
	return {
		queryId: results.id,
		query: results.query,
		endpoint: web3.utils.hexToUtf8(results.endpoint),
		subscriber: results.subscriber,
		endpointParams: results.endpointParams.map(web3.utils.hexToUtf8),
		onchainSub: results.onchainSubscriber
	}
}
