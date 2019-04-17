/**
  Call zap server to let it knows oracle is still online
*/
import * as Config from "./Config.json"
const Web3 = require('web3');
import {toHex,utf8ToHex} from "web3-utils"
import {ZapProvider} from "@zapjs/provider"
import {ZapBondage} from "@zapjs/bondage"
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const w3 = new Web3(new HDWalletProviderMem(Config.mnemonic, Config.NODE_URL))

const rq = require("request-promise")
const ZAP_SERVER = "http://localhost:8000"

export const updateStatus = function(web3:any,oracle:any,endpoint:any){
  update(web3,oracle,endpoint)
  setInterval(()=>{
    update(web3,oracle,endpoint)
  },3*60*1000) //every  minutes
}

async function update(web3:any,oracle:any,endpoint:any){
  console.log("update status")
  try{
    let time = new Date().getTime()
    const data = endpoint + ":"+time
    console.log(data)
    let signature = await web3.eth.sign(data,oracle)
    let options = {
      method:"POST",
      uri:ZAP_SERVER+"/update",
      body:{
        data,
        signature
      },
      json:true
    }
    const result = await rq(options)
    console.log(result)
  }catch(e){
    console.error(e)
  }
}
