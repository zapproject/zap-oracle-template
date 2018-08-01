import { ZapProvider } from "@zapjs/provider";
import { ZapToken } from "@zapjs/zaptoken";
const Web3 = require('web3');

/**
 * Handles a query
 * @param writer - HTTP Web3 instance to respond to query with
 * @param queryEvent - Web3 incoming query event
 * @returns ZapProvider instantiated
 */
 export async function handleQuery(providerR: ZapProvider, queryEvent:any): Promise<void> {
 	var web3 = new Web3();

 	const query:string = queryEvent.returnValues.query;
 	const endpoint:string = web3.utils.hexToUtf8(queryEvent.returnValues.endpoint);
 	const subscriber:string = queryEvent.returnValues.subscriber;
 	const endpointParams:string[] = queryEvent.returnValues.endpointParams;
 	for(var i:number = 0; i< endpointParams.length; i++){
 		endpointParams[i] = web3.utils.hexToUtf8(endpointParams[i]);
 	}

	const onchainSub:boolean = queryEvent.returnValues.onchainSubscriber;


 	console.log("Received query to", endpoint, "from", subscriber);
 	console.log("Query:", query, "(", endpointParams, ")");

 	// we expect a timestamp from query
 }

