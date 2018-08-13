import { requestPromise, ZapQueryEvent, ZapResponder, initialize} from "./helper";

/* Starts the oracle. Creates it (if it does not exist), and starts listening for queries */
initialize().catch(err => console.error('zap-oracle-template error:', err));

//==============================================================================================================
// Provider Constants
//==============================================================================================================

export const ProviderData: any = {
	title: "Template-Oracle",
	public_key: "abcdef",
	endpoint: "N/A",
	endpoint_params: []
};

export const Responders: ZapResponder = {
	"zapprice": {
		responder: priceResponder,
		curve: [3, 0, 0, 2, 1000]
	}

	// define more endpoints and their callbacks here
}; 

//==============================================================================================================
// Web3 instance creator
//==============================================================================================================

const INFURA_WS = "wss://kovan.infura.io/ws/xeb916AFjrcttuQlezyq";
const HDWalletProviderMem = require("truffle-hdwallet-provider");
/* Put your mnemonic here */
const mnemonic: string = "rally later assist feature wait primary addict sister remove language piece drink";

export async function getWeb3Provider() {		
	return new HDWalletProviderMem(mnemonic, INFURA_WS);
}

//==============================================================================================================
// Responder callback functions
//==============================================================================================================

async function priceResponder(web3: any, event: ZapQueryEvent): Promise<string[]> {
	// do stuff with these values
	const { queryId,
			query,
			endpoint,
			subscriber,
			endpointParams,
			onchainSub } = event;

	const zapPerBase: number = await getZapPrice(query);	

	return [web3.utils.padLeft(web3.utils.toHex(zapPerBase), 64)];
}

//==============================================================================================================
// HTTP API calls to online data providers
//==============================================================================================================

/* Sample HTTP data provider */
const CMC_URL: string = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ZAP&convert=";
/* CoinMarketCap API Key (test use only) */
const CMC_KEY: string = "&CMC_PRO_API_KEY=1b1593df-f732-4a58-8b84-dbc3bd896741";

/* Uses the CoinMarketCap API to get the current exchange ratio of ZAP to another base currency */
async function getZapPrice(base:string): Promise<number>{
	try {
		const body: any = await requestPromise(CMC_URL + base + CMC_KEY);
		const json: any = JSON.parse(body);
		const ratio = json.data["ZAP"].quote[base].price;

		// amount of Zap per 1 full ETH/BTC/etc
		const perBase = 1e18/ratio;
		console.log(`1 ${base} = ${perBase} Wei ZAP`);
		return perBase;
	}
	catch (err) {
		return -1;
	}
}