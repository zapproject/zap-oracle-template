const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

export async function getResponse(query:string,params:string[]|[]){
	//Get data based on the query string and Parameters
	let data:any = await CoinGeckoClient.simple.price({
    ids: [query],
    vs_currencies: params,
});
	var arr:any = [];
	for (var key in data["data"][query]){
		arr.push(Math.floor(data["data"][query][key]*100));
	}
	// console.log(arr);	
		return arr;

}

// var func = getResponse("bitcoin",["eur","usd"])