//import { loadProvider, createProvider, createProviderCurve, getEndpointInfo, doBondage, doUnbondage } from "./provider";
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const Web3 = require('web3');
import { ZapRegistry} from "@zapjs/registry";

import { initProvider, createProvider} from "./providerFactory";
import { handleQuery, getPrice} from "./provider";

const INFURA_WS = "wss://kovan.infura.io/ws/xeb916AFjrcttuQlezyq";
const INFURA_HTTP = "https://kovan.infura.io/xeb916AFjrcttuQlezyq";

const mnemonic:string = "rally later assist feature wait primary addict sister remove language piece drink";

async function main() {

var web3 = new Web3();
	const reader: any = new Web3(new Web3.providers.WebsocketProvider(INFURA_WS));
	const writer: any = new Web3(new HDWalletProviderMem(mnemonic, INFURA_HTTP));	

	// Get the provider and contracts
	const { providerR, providerW, contracts } = await initProvider(reader, writer);

	const registry: ZapRegistry = providerR.zapRegistry;
	const title = await registry.getProviderTitle(providerR.providerOwner);

	if(title.length == 0){
		console.log("Initializing provider");
		createProvider(providerW);
	} else {
		console.log("Oracle already exists. Listening for queries");
		providerR.listenQueries({}, function(err: any, event: any){ 
			if(err) throw err;
			handleQuery(providerW, event)
		});
	}
}

main();
