import {Oracle} from "../src/Oracle";
import {ZapSubscriber} from "@zapjs/subscriber"
import {Config} from "../src/Config";
const Web3 = require('web3');
const HDWalletProviderMem = require("truffle-hdwallet-provider");

export async function queryProvider(providerAddress:string){
    // setup provider and start listenting to query
    const oracle = new Oracle()
    oracle.initialize().catch(console.error);

    //setup subscriber, for demo reason, we use same wallet as provider's
    let web3 = new Web3(new HDWalletProviderMem(Config.mnemonic, Config.NODE_WS,1))
    let accounts = await web3.eth.getAccounts();
    let subcriberOwner = accounts[0]
    let zapSubscriber = new ZapSubscriber(subcriberOwner, {networkProvider: web3, networkId: await web3.eth.net.getId()})

    const provider = await oracle.getProvider()
    await oracle.delegateBond(subcriberOwner,100)

    //start listening to incoming reponses
    zapSubscriber.listenToOffchainResponse({},(err:any,logs:any)=>{
        console.log("Response event from provider : ",logs)
    })

    //Get Oracle query list and query
    let endpoints = oracle.getEndpoints();
    endpoints.map((endpoint:any)=>{
        console.log(zapSubscriber.zapBondage.contract.options.address)
        endpoint.queryList.map((query:any)=>{
            zapSubscriber.queryData({
                provider: providerAddress,
                query: query.query,
                endpoint: endpoint.name,
                endpointParams: query.params.slice(0),
                gas: 300000
            })
                .then(console.log)
                .catch(console.error)
        })
    })

}
