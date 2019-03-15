const binance = require("node-binance-api")()
const Promise = require("bluebird")
const URL = "https://api.binance.com/api/v3/avgPrice"
export async function getResponse(query:string,params?:string[]|[]){
	let pair = query.toUpperCase()
	console.log(pair,"pair in get respond")
	const pr = Promise.promisify(binance.prices)
	try{
		const res = await pr(pair)
		return [res[pair]]
	}catch(e){
		return [0] //return 0 to indicate price info is not available
	}

}
