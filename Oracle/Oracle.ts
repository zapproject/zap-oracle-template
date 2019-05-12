import {getResponse} from "./Responder"
import * as Config from "./Config.json"
const Web3 = require('web3');
import { ZapProvider } from "@zapjs/provider";
import {ZapToken} from "@zapjs/zaptoken"
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const {toBN,fromWei, hexToUtf8} =require("web3-utils");
const assert = require("assert")
const IPFS = require("ipfs-mini")
const ipfs = new IPFS({host:'ipfs.infura.io',port:5001,protocol:'https'})
const IPFS_GATEWAY = "https://gateway.ipfs.io/ipfs/"
import {connectStatus} from "./Status"

export  class ZapOracle {
    web3:any
    oracle:any
    zapToken:any
    constructor(){
        this.web3 = new Web3(new HDWalletProviderMem(Config.mnemonic, Config.NODE_URL))
        this.oracle = null
        this.zapToken = null
    }
    validateConfig() {
        const EndpointSchema = Config.EndpointSchema
        assert(Config.mnemonic, "mnemonic is required to run Oracle")
        assert(Config.title, "title is required to run Oracle")
        assert(Config.public_key, "public_key is required to run Oracle")
        assert(EndpointSchema.name, "Endpoint's name is required")
        assert(EndpointSchema.curve, `Curve is required for endpoint ${EndpointSchema.name}`)
        assert(EndpointSchema.queryList.length > 0, `query list is recommended for data offer`)

    }


    /**
     * Initializes the oracle. Creates the provider if it does not exist already.
     * For each endpoint in schema, create curve and params
     * Starts listening for queries and calling handleQuery function
     */
    async initialize() {
        await this.validateConfig()
        // Get the provider and contracts
        await this.getProvider();
        await this.delay(5000)
        const title = await this.oracle.getTitle();
        console.log(title)
        if (title.length == 0) {
            console.log("No provider found, Initializing provider");
            const res: string = await this.oracle.initiateProvider({title: Config.title, public_key: Config.public_key});
            console.log("Successfully created oracle", Config.title);
        }
        else {
            console.log("Oracle exists");
            if( title != Config.title){
              console.log("Changing title")
              const res:string = await this.oracle.setTitle({title:Config.title})
              console.log("Successfully changed Title : ",res)

            }
        }
        //Create endpoints if not exists
        const endpoint = Config.EndpointSchema
        let curveSet = await this.oracle.isEndpointCreated(endpoint.name)
        if (!curveSet) {
            //create endpoint
            console.log("No matching Endpoint found, creating endpoint")
            if(endpoint.broker == "")
                endpoint.broker = "0x0000000000000000000000000000000000000000"
            const createEndpoint = await this.oracle.initiateProviderCurve({endpoint: endpoint.name, term: endpoint.curve, broker: endpoint.broker});
            console.log("Successfully created endpoint ", createEndpoint)
            //setting endpoint params with indexed query string
            let endpointParams:string[] = []
            for(let query of endpoint.queryList){
                endpointParams.push("Query string :"+ query.query +", Query params :"+JSON.stringify(query.params)+", Response Type: "+query.responseType)
            }
            console.log("Setting endpoint params")

            const txid = await this.oracle.setEndpointParams({endpoint: endpoint.name, endpoint_params: endpointParams})
            console.log(txid)
            // setting {endpoint.json} file and save it to ipfs
            let ipfs_endpoint:any = {}
            ipfs_endpoint.name =  endpoint.name
            ipfs_endpoint.curve = endpoint.curve
            ipfs_endpoint.broker = endpoint.broker
            ipfs_endpoint.params = endpointParams
            // add to ipfs file
            console.log("Saving Endpoint info into ipfs")
            ipfs.addJSON(ipfs_endpoint,(err:any,res:any)=>{
                if(err){
                    console.error("Fail to save endpoint data to ipfs : ", ipfs_endpoint)
                    process.exit(err)
                }
                //save ipfs hash to this.oracle param
                console.log("Successfully saved Endpoint json file into ipfs, saving ipfs link to oracle's params")
                this.oracle.setProviderParameter({key:`${endpoint.name}.json`,value:IPFS_GATEWAY+res})
                    .then((txid:string)=>{console.log("saved endpoint info to param with hash : ",res,txid)})
            })
            //if there is a md string => save to provider params
            if(endpoint.md && endpoint.md!=""){
                ipfs.add(endpoint.md,(err:any,res:any)=>{
                  if(err){
                      console.error("Fail to save endpoint .md file to ipfs", endpoint)
                      process.exit(err)
                  }
                  //set ipfs hash as provider param
                  this.oracle.setProviderParameter({key:`${endpoint.name}.md`,value:IPFS_GATEWAY+res})
                    .then((txid:string)=>{console.log("saved endpoint info to param with hash : ",res,txid)})

                })
            }
            else{
              console.log("No md value file, skipping")
            }
        }
        else {
          //Endpoint is initialized, so ignore all the setup part and listen to Query
            console.log("curve is already  set : ", await this.oracle.getCurve(endpoint.name))
        }
        //UPDATE STATUS TO ZAP
        connectStatus(this.web3,endpoint)
        console.log("Start listening and responding to queries")
        this.oracle.listenQueries({}, (err: any, event: any) => {
            if (err) {
                throw err;
            }
            this.handleQuery(event);
        });

    }

    /**
     * Loads a ZapProvider from a given Web3 instance
     * @param web3 - WebSocket Web3 instance to load from
     * @returns ZapProvider instantiated
     */

    delay = (ms:number) => new Promise(_ => setTimeout(_, ms));
    async getProvider() {
        // loads the first account for this web3 provider
        const accounts: string[] = await this.web3.eth.getAccounts();
        if (accounts.length == 0) throw('Unable to find an account in the current web3 provider, check your Config variables');
        const owner: string = accounts[0];
        this.oracle = new ZapProvider(owner, {
            networkId: (await this.web3.eth.net.getId()).toString(),
            networkProvider:this.web3.currentProvider
        });
        this.zapToken = new ZapToken({
            networkId: (await this.web3.eth.net.getId()).toString(),
            networkProvider:this.web3.currentProvider
        })
        const ethBalance = await this.web3.eth.getBalance(owner)
        const zapBalance = await this.zapToken.balanceOf(owner)
        console.log("Wallet contains:", fromWei(ethBalance,"ether"),"ETH ;", fromWei(zapBalance,"ether"),"ZAP");
    }

//==============================================================================================================
// Query Handler
//==============================================================================================================

    /**
     * Handles a query
     * @param writer - HTTP Web3 instance to respond to query with
     * @param queryEvent - Web3 incoming query event
     * @returns ZapProvider instantiated
     */


    async handleQuery(queryEvent: any): Promise<void> {
        const results: any = queryEvent.returnValues;
        let response: string[] | number[]
        // Parse the event into a usable JS object
        const event: any = {
            queryId: results.id,
            query: results.query,
            endpoint: hexToUtf8(results.endpoint),
            subscriber: results.subscriber,
            endpointParams: results.endpointParams.map(hexToUtf8),
            onchainSub: results.onchainSubscriber
        }
        if (event.endpoint != Config.EndpointSchema.name) {
            console.log('Unable to find the callback for', event.endpoint);
            return;
        }
        console.log(results)

        console.log(`Received query to ${event.endpoint} from ${event.onchainSub ? 'contract' : 'offchain subscriber'} at address ${event.subscriber}`);
        console.log(`Query ID ${event.queryId.substring(0, 8)}...: "${event.query}". Parameters: ${event.endpointParams}`);
        for (let query of Config.EndpointSchema.queryList) {
            try{
              // Call the responder callback to get the data needed for this query
              let response = await getResponse(event.query,event.endpointParams)
              console.log("got response from getResponse method : ", response)

              // Send the response
              console.log("Responding to offchain subscriber : ")
                let txid = await this.oracle.respond({
                    queryId: event.queryId,
                    responseParams: response,
                    dynamic: query.dynamic
                })

              console.log('Responded to', event.subscriber, "in transaction", txid.transactionHash);
            }catch(e){
              throw new Error(`Error responding to query ${event.queryId} : ${e}`)
            }
        }
    }
}
