"use strict"

const axios = require('axios') 
const url = 'https://api-pub.bitfinex.com/v2/'

const pathParams = 'ticker/tBTCUSD' // Change these based on relevant path params
const queryParams = '' // Change these based on relevant query params

async function request() {
   try {
       const resp = await axios.request(`${url}/${pathParams}?${queryParams}`);
       console.log(`STATUS ${resp.status} - ${JSON.stringify(resp.data)}`);
   }
   catch (err) {
       console.log(err)
   }
}

request()