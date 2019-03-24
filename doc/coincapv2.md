## CoinCap.io 'toUSD'

This Oracle currently supports the 'toUSD' query string and supplies the current USD value of a given currency(supported currencies given below).

For onchain/offchain query examples, see https://zapproject.gitbook.io/zapproject

A query consists of the querystring 'toUSD' and an array of parameters. 
- Param[0] is a string indicating which cryptocurrency to return a price for 
- Param[1], is an optional precision value
	+ If you add a precision parameter the oracle will return an integer, if you don't , it will return a string

    + [ 'bitcoin'] 
    returns
    [ '4014.6551113459212277' ]
    
    + [ 'bitcoin', '2' ] 
    returns
    [401467]

A uery from zap-term might look like this
- Query: "toUSD"
- Endpoint Parameter: bitcoin
- Endpoint Parameter(Optional): 2
- 
The result returned would be the price of BTC in USD as an integer in cents
From within your smart contract, you can call the function as so
```
uint256 id = dispatch.query(oracleAddress, "toUSD", "CoinCap", ["bitcoin","2",2]);
```
Zap will listen for an response, and send you the result. Make certain you have a callback function in your smart contract that listens for string arrays.

This oracle will return 1 string if the transaction is succesful, and two if it is not.
```
    event Results(string response1, string response2, string response3, string response4);

     function callback(uint256 id, string response1) external {
        emit Results(response1, "NOTAVAILABLE", "NOTAVAILABLE", "NOTAVAILABLE");
    }
    
    function callback(uint256 id, string response1, string response2) external {
        emit Results(response1, response2, "NOTAVAILABLE", "NOTAVAILABLE");
    }
```
Supported currencies:

"bitcoin",
"ethereum",
"ripple",
"bitcoin-cash",
"eos",
"stellar",
"litecoin",
"cardano",
"tether",
"iota",
"tron",
"ethereum-classic",
"monero",
"neo",
"dash",
"binance-coin",
"nem",
"tezos",
"zcash",
"omisego",
"vechain",
"qtum",
"0x",
"bitcoin-gold",
"bytecoin-bcn",
"bitshares",
"lisk",
"decred",
"zilliqa",
"aeternity",
"maker",
"digibyte",
"icon",
"ontology",
"dogecoin",
"augur",
"steem",
"moac",
"verge",
"siacoin",
"bytom",
"basic-attention-token",
"bitcoin-diamond",
"hshare",
"rchain",
"golem-network-tokens",
"kucoin-shares",
"nano",
"stratis",
"status",
"pundi-x",
"waves",
"populous",
"mithril",
"iostoken",
"maidsafecoin",
"MaidSafeCoin",
"komodo",
"digixdao",
"waltonchain",
"huobi-token",
"gxchain",
"kin",
"aelf",
"ardor",
"wanchain",
"metaverse",
"monacoin",
"aion",
"dentacoin",
"funfair",
"bancor",
"zencash",
"holo",
"decentraland",
"bitcoin-private",
"nebulas-token",
"monaco",
"emercoin",
"wax",
"dropil",
"cryptonex",
"loopring",
"odem",
"ark",
"kyber-network",
"power-ledger",
"reddcoin",
"mybit-token",
"chainlink",
"nxt",
"gas",
"pivx",
"polymath-network",
"loom-network",
"tenx",
"theta-token",
"cybermiles",
"elastos",
"nuls",
"bibox-token"
