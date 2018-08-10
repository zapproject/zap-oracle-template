import { ZapProvider } from "@zapjs/provider";
import { ZapToken } from "@zapjs/zaptoken";
import { requestPromise, ZapQueryEvent, ZapResponder } from "./utils";

/* Sample HTTP data provider */
const CMC_URL: string = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ZAP&convert=";
/* CoinMarketCap API Key (test use only) */
const CMC_KEY: string = "&CMC_PRO_API_KEY=1b1593df-f732-4a58-8b84-dbc3bd896741";

/* Uses the CoinMarketCap API to get the current exchange ratio of ZAP to another base currency */
/* Returns a decimal temperature (Fahrenheit) to the thousandths digit */
async function getZapPrice(base:string): Promise<number>{
	try {
		const body: any = await requestPromise(CMC_URL + base + CMC_KEY);
		const json: any = JSON.parse(body);
		return json.data["ZAP"].quote[base].price;
	}
	catch (err) {
		return 0;
	}
}

async function priceResponder(web3: any, event: ZapQueryEvent): Promise<string[]> {
	const { queryId,
	    query,
	    endpoint,
	    subscriber,
	    endpointParams,
	    onchainSub } = event;

	console.log(`Received query to ${endpoint} from ${onchainSub ? 'contract' : 'person'} at address ${subscriber}`);
	console.log(`Query ${queryId.substring(0, 8)}...: "${query}". Parameters: ${endpointParams}`);

	const zapPer: number = await getZapPrice(query);	
	const perZap = web3.utils.toWei((1 / zapPer).toString());

	console.log(`Ratio of ZAP/${query}: ${zapPer}`);
	console.log(`1 ${query} = ${perZap} Wei ZAP`);

	return [web3.utils.padLeft(web3.utils.toHex(perZap), 64)];
}

export const responders: ZapResponder = {
	"zapprice": priceResponder
};