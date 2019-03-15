# Zap-oracle-template


## Purpose :
To help users fully creating and running an off-chain Oracle with just couple config and 1 function implementation.
## ORACLE TEMPLATE SETUP EXPLAINED

### Config Setting :
  - Oracle's information :
    + Title, Public key, Mnemonic, Node URL
    + Endpoint : Name, Curve, broker, md (description about endpoint), query list ( query string accepted and response type)
### What will be created  once setup and run:
1. Oracle registered if none exists
2. Endpoint created if Endpoint name in config has not been created
  + Endpoint.json file will be created containing information about query list and endpoint, saved in ipfs and set as Endpoint's params on-chain
  + Endpoint.md file will be created, saved in ipfs and set as Provider's params on-chain
3. If Endpoint is already initiated, the step 2 will be ignored


### Code Layout :

1. Config.ts : data about your wallet ,ethereum node and your provider's pubkey and title
3. Oracle.ts : Template for Create/Manage  flow
4. Responder.ts :  Stub callback function when receive query event and return result

### Usage :

1. Configure Config.ts
2. Implement function `getResponse` in Responder.ts
3. Run `npm start` to start create/get Oracle and start listening to queries   

## Note :

- Ensure you have enough ETH in your address for responding to queries
<<<<<<< HEAD
## Oracle Setup Explained
- `npm start` will run `Oracle/index.js` `initialize()` funcfion
1. Find info about the current node in `config.js` file, including link to parity/geth node and mnemonic
2. Get schema from Oracle/schema.js; loop through the list of endpoint
3. If an endpoint in the list is not created, --> create endpoint, and set params according to information in the list
4. Upon created endpoint successfully, an endpoint.json object will be created and saved to ipfs to create a hash and link to that hash
5. Upon adding to ipfs successfully, link to hash will be set as provider's params for retrieving later
6. If there is any text in field `md` of new endpoint schema,  ipfs will be created for that text and a link will be set as provider's param 
## Subscriber example

#### Subscriber_contract_example

- Onchain subscriber contract example
    + Set provider to interact with
    + Query provider (regarding to provided schema from provider)
    + Implement callback for provider's response

#### Subscriber_example.js

- Offchain subscriber example
    + Query endpoint and params (regarding to provided schema from provider)
    + Listen to OffchainResponse event from Provider

#### Demo.ts
- Workflow example from setting up oracle to running subscriber
- Run : `yarn startDemo`

## MaxZap Coin Price Feed
- These Oracle Endpoints Take in two parameters, and the "price" querytype
	+ The parameters are the conversion "From" and "To".
	+ For example, Using the Parameters "BTC" followed by "USD" will show the price of BTC in USD

- The DaveBTC endpoint only uses the BTC to USD conversion and uses the "average" querytype
	+ What this does is get the average of the other endpoints and excludes any outliers within 3 percent of the average

- CoinCap
	+ From: http://coincap.io/coins/
	+ To: btc, eth, eur, ltc, usd, zec
- Coinbase
	+ https://api.coinbase.com/v2/currencies
- CryptoCompare
	+ https://min-api.cryptocompare.com/data/all/coinlist
- BitFinex
	+ https://api.bitfinex.com/v2/tickers?symbols=ALL
- Poloniex
	+ https://poloniex.com/public?command=returnTicker
- LakeBTC
	+ https://api.lakebtc.com/api_v2/ticker
- BitStamp
	+ BTC, ETH, XRP, BCH, USD, EUR
- CoinMarketCap
	+ https://coinmarketcap.com/all/views/all/
- CoinDesk
	+ From:BTC
	+ To: Fiat
- Kraken
	+ https://api.kraken.com/0/public/AssetPairs
- Gemini
	+ https://api.gemini.com/v1/symbols
=======
>>>>>>> a402378053615ab888890a3f9b3b462c931e80d5
