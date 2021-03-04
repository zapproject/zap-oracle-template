"use strict"

const fetch = require('node-fetch') 
const url = 'https://api-pub.bitfinex.com/v2/'

const pathParams = 'tickers' // Change these based on relevant path params
const queryParams = 'symbols=fUSD,tBTCUSD' // Change these based on relevant query params, symbols=ALL for all

async function request() {
   try {
       const req = await fetch(`${url}/${pathParams}?${queryParams}`)
       const response = await req.json()
       console.log(`STATUS ${req.status} - ${JSON.stringify(response)}`)
   }
   catch (err) {
       console.log(err)
   }
}

request()