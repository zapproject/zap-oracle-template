import { ZapProvider } from "@zapjs/provider";
import { ZapToken } from "@zapjs/zaptoken";
const Web3 = require('web3');

const http = require('http');

/* Sample HTTP data provider */
const CMC_URL:string = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ZAP&convert=";
/* CoinMarketCap API Key (test use only) */
const CMC_KEY:string = "&CMC_PRO_API_KEY=1b1593df-f732-4a58-8b84-dbc3bd896741";

/**
 * Handles a query
 * @param writer - HTTP Web3 instance to respond to query with
 * @param queryEvent - Web3 incoming query event
 * @returns ZapProvider instantiated
 */
 export async function handleQuery(providerW: ZapProvider, queryEvent:any): Promise<void> {
 	// helper Web3 instance
 	var web3 = new Web3();

 	const query:string = queryEvent.returnValues.query;
 	const endpoint:string = web3.utils.hexToUtf8(queryEvent.returnValues.endpoint);
 	const subscriber:string = queryEvent.returnValues.subscriber;
 	const endpointParams:string[] = queryEvent.returnValues.endpointParams;
 	const id: string = queryEvent.returnValues.id;


 	for(var i:number = 0; i< endpointParams.length; i++){
 		endpointParams[i] = web3.utils.hexToUtf8(endpointParams[i]);
 	}

 	const onchainSub:boolean = queryEvent.returnValues.onchainSubscriber;

 	console.log("Received query to", endpoint, "from", subscriber);
 	console.log("Query:", query, "(", endpointParams, ")");

 	var ratio:number = await getPrice(query);	
 	console.log("Ratio of ZAP/" + query + ":", ratio);
 	// 1 ETH = x Zap Wei
 	ratio = web3.utils.toWei((1/ratio).toString());
 	console.log("1 ETH =", ratio, "Wei ZAP");

 	var response:string = web3.utils.padLeft(web3.utils.toHex(ratio), 64);
 	console.log(response);

 	// we expect a timestamp from query
 	providerW.zapDispatch.respond({ queryId: id, responseParams: [response], from: providerW.providerOwner, dynamic: true }).then((txid: any) => { 
 		console.log('Response Transaction to', subscriber, "Hash:", txid.transactionHash); 
 	});
 }


/* Uses the CoinMarketCap API to get the current exchange ratio of ZAP to another base currency */
/* Returns a decimal temperature (Fahrenheit) to the thousandths digit */
export async function getPrice(base:string): Promise<number>{
	const body: any = await requestPromise(CMC_URL + base + CMC_KEY);
	const json: any = JSON.parse(body);
	const ratio: number = json.data["ZAP"].quote[base].price;
	return ratio;
}

