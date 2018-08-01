import { ZapArbiter } from "@zapjs/arbiter";
import { ZapBondage } from "@zapjs/bondage";
import { ZapDispatch } from "@zapjs/dispatch";
import { ZapRegistry } from "@zapjs/registry";
import { ZapProvider } from "@zapjs/provider";
import { ZapToken } from "@zapjs/zaptoken";

import { join } from "path";

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
	console.log(accounts[0]);
	return accounts[0];
}