import { sleep, loadContracts, loadAccount } from "./utils";
import { ZapBondage } from "@zapjs/bondage";
import { Curve } from "@zapjs/curve";
import { ZapProvider } from "@zapjs/provider";
import { ZapToken } from "@zapjs/zaptoken";

/**
 * Loads a ZapProvider from a given Web3 instance
 *
 * @param reader - WS Web3 instance to load from
 * @param writer - HTTP Web3 instance to load from
 * @returns ZapProvider instantiated
 */
 export async function initProvider(web3: any): Promise<{ contracts: any, provider: ZapProvider}> {
 	const owner: string = await loadAccount(web3);

 	console.log("Found address:", owner);
 	console.log("It has", await web3.eth.getBalance(owner) / 1e18, "ETH");

 	const contracts = await loadContracts(web3);

 	return {
 		provider: new ZapProvider(owner, contracts),
 		contracts: contracts
 	};
 }

/**
 * Initializes the provider and the weather endpoint
 *
 * @param provider - Provider to use
 */
 export async function createProvider(provider: ZapProvider): Promise<void> {
 	const title:string = "Template-Oracle";
 	const public_key = "abcdef";
 	const endpoint:string = "zapprice";
 	const endpoint_params: string[] = [];

 	console.log('Created provider', title);

 	await provider.initiateProviderCurve({ endpoint, term: [3, 0, 0, 2, 1000], from: provider.providerOwner });

 	console.log('Created endpoint', endpoint);
 }

