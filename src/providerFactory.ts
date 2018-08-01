import { sleep, loadContracts, loadAccount} from "./utils";
import { ZapBondage } from "@zapjs/bondage";
import { Curve } from "@zapjs/curve";
import { ZapProvider } from "@zapjs/provider";
import { ZapToken } from "@zapjs/zaptoken";
const Web3 = require('web3');

/**
 * Loads a ZapProvider from a given Web3 instance
 *
 * @param reader - WS Web3 instance to load from
 * @param writer - HTTP Web3 instance to load from
 * @returns ZapProvider instantiated
 */
 export async function initProvider(reader: any, writer:any): Promise<{ contracts: any, providerR: ZapProvider, providerW: ZapProvider}> {
 	const owner: string = await loadAccount(writer);

 	console.log("Found address:", owner);
 	console.log("It has", await writer.eth.getBalance(owner)/1e18, "ETH");

 	const contractsR = await loadContracts(reader);
 	const contractsW = await loadContracts(writer);

 	return {
 		providerR: new ZapProvider(Object.assign(contractsR, { owner })),
 		providerW: new ZapProvider(Object.assign(contractsW, { owner })),
 		contracts: contractsW
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
 	const endpoint:string = "weather";
 	const endpoint_params: string[] = [];

 	await provider.initiateProvider({ public_key, title, endpoint, endpoint_params });

 	console.log('Created provider', title);

 	const constants:number[] = [1e18,0,0];
 	const parts: number[] = [1,1000];
 	const dividers:number[] = [1];

 	const curve: Curve = new Curve(constants, parts, dividers);

 	await provider.initiateProviderCurve({ endpoint, constants: curve.constants, parts: curve.parts, dividers: curve.dividers });

 	console.log('Created endpoint', endpoint);
 }

