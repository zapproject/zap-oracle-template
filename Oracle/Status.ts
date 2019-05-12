/**
  Call zap server to let it knows oracle is still online
*/
import * as Config from "./Config.json"
const Web3 = require('web3');
import {toHex,utf8ToHex} from "web3-utils"
import {ZapProvider} from "@zapjs/provider"
import {ZapBondage} from "@zapjs/bondage"
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const io =require("socket.io-client");

const rq = require("request-promise")
const ZAP_SERVER = "http://localhost:8000"

export const updateStatus = function(web3:any,oracle:any,endpoint:any){
  update(web3,oracle,endpoint)
  setInterval(()=>{
    update(web3,oracle,endpoint)
  },3*60*1000) //every  minutes
}

async function update(web3:any,oracle:any,endpoint:string){
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


export const connectStatus= async (web3:any,endpoint:any)=>{
  let accounts = await web3.eth.getAccounts()
  let oracle = accounts[0]
  console.log(oracle)
  let socket = io(Config.STATUS_URL,{path:"/ws/",secure:true})
  socket.on("connect",async ()=>{
    const signature = await web3.eth.sign(endpoint,oracle)
    console.log(signature)
    socket.emit("authentication",{endpoint:"TrendSignals",signature})
  })
  socket.on("authenticated",()=>{
    console.log("authenticated")
  })
  socket.on("unauthorized",()=>{
    console.log("unauthorized")
  })
}
