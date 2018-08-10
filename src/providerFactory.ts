import { sleep, loadAccount } from "./utils";
import { ZapBondage } from "@zapjs/bondage";
import { Curve } from "@zapjs/curve";
import { ZapProvider } from "@zapjs/provider";
import { ZapToken } from "@zapjs/zaptoken";
import { join } from "path";

/**
 * Loads a ZapProvider from a given Web3 instance
 *
 * @param reader - WS Web3 instance to load from
 * @param writer - HTTP Web3 instance to load from
 * @returns ZapProvider instantiated
 */
 export async function initProvider(web3: any): Promise<ZapProvider> {
 	const owner: string = await loadAccount(web3);

 	console.log("Found address:", owner);
 	console.log("It has", await web3.eth.getBalance(owner) / 1e18, "ETH");

 	return new ZapProvider(owner, {
		artifactsDir: join(__dirname, '../', 'node_modules/@zapjs/artifacts/contracts/'),
		networkId: (await web3.eth.net.getId()).toString(),
		networkProvider: web3.currentProvider,
	});
}