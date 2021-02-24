//1. Import coingecko-api
const CoinGecko = require('coingecko-api');
var Decimal = require('decimal.js');
//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

//3. Make calls
var func = async () => {
        let data = await CoinGeckoClient.ping();
};

export async function getResponse(coin: string, params?: string[] | []) {
        try {
                let data = await CoinGeckoClient.coins.fetchMarketChart(coin.toLowerCase());
                const price = data.data.prices[data.data.prices.length - 1][1]
                console.log("data for coin", price[1])
                return [price.toString()]
        } catch (e) {
                return [0] //return 0 to indicate price info is not available
        }
}
export async function getResponseInt(coin: string, params?: string[] | []) {
        try {
                let data = await CoinGeckoClient.coins.fetchMarketChart(coin.toLowerCase());
                const price = data.data.prices[data.data.prices.length - 1][1]
                console.log("data for coin", price[1])
                let p=new Decimal(price.toString())
                p=p.times('10e+18').floor()
                return [p.toNumber()]
        } catch (e) {
                return [0] //return 0 to indicate price info is not available
        }
}
