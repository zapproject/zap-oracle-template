import {getResponse} from "./Responder"
import * as Config from "./Config.json"
import {Account, Node } from '@zapjs/eos-utils';
import { DemuxEventListener } from '@zapjs/eos-node-utils';
import { Provider } from "@zapjs/eos-provider";
import { Subscriber } from '@zapjs/eos-subscriber';
const assert = require("assert")
const IPFS = require("ipfs-mini")
const ipfs = new IPFS({host:'ipfs.infura.io',port:5001,protocol:'https'})
const IPFS_GATEWAY = "https://gateway.ipfs.io/ipfs/"
//import {connectStatus} from "./Status"
const hdkey = require('hdkey');
const wif = require('wif');
const bip39 = require('bip39');
const ecc = require("eosjs-ecc");
const BigNumber = require('big-number');
import { Serialize, Numeric } from 'eosjs';


export  class ZapOracle {
    node:any;
    oracle:any;
    subscriber: any;
    zapToken:any;
    constructor(){
        this.node = new Node({
            key_provider: ['5KRuasWaLFJ7cSRYp3ituHXwb8dhxZXjsGdRvF3A1uWBkVcjNzQ'],//[this.getPrivateKey(Config.mnemonic)],
            verbose: false,
            http_endpoint:
            Config.NODE_URL,
            contract: Config.zapcontract,
            chain_id: Config.chain_id
        });
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
            const res: string = await this.oracle.setTitle(Config.title);
            console.log("Successfully created oracle", Config.title);
        }
        else {
            console.log("Oracle exists");
            if( title != Config.title){
              console.log("Changing title")
              const res:string = await this.oracle.setTitle(Config.title)
              console.log("Successfully changed Title : ",res)

            }
        }
        //Create endpoints if not exists
        const endpoint = Config.EndpointSchema
        let curveSet = await this.endpointCreated(endpoint.name)
        if (!curveSet.length) {
            //create endpoint
            console.log("No matching Endpoint found, creating endpoint")
            const createEndpoint = await this.oracle.addEndpoint(endpoint.name, endpoint.curve, endpoint.broker);
            console.log("Successfully created endpoint ", createEndpoint.transactionId)
            //setting endpoint params with indexed query string
            let endpointParams:string[] = []
            for(let query of endpoint.queryList){
                endpointParams.push("Query string :"+ query.query +", Query params :"+JSON.stringify(query.params)+", Response Type: "+query.responseType)
            }
            console.log("Setting endpoint params")

            const txid = await this.oracle.setParams(endpoint.name, endpointParams);
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
            console.log("curve is already  set : ", curveSet[0].functions);
        }
        console.log("Start listening and responding to queries")
        const listener =  new DemuxEventListener();
        DemuxEventListener.start([Config.NODE_URL, Config.zapcontract, 1000, 'smallListener']);
        listener.on('zapcoretest4::query', (err: any, eventArray: any) => {
            const event = eventArray[0];
            if (err && event.provider === this.oracle.getAccount().name && event.endpoint === Config.EndpointSchema.name) {
                throw err;
            }
            if(event.data.provider === this.oracle.getAccount().name && event.data.endpoint === Config.EndpointSchema.name) {
                this.handleQuery(event.data);
            }
        });

    }

    /**
     * Loads a ZapProvider from a given Web3 instance
     * @param web3 - WebSocket Web3 instance to load from
     * @returns ZapProvider instantiated
     */

    delay = (ms:number) => new Promise(_ => setTimeout(_, ms));

    getPrivateKey(mnemonic: string) {
        const seed = bip39.mnemonicToSeedHex(mnemonic)
            const master = hdkey.fromMasterSeed(new Buffer(seed, 'hex'))
            const nodem = master.derive("m/44'/194'/0'/0/0")
            return  wif.encode(128, nodem._privateKey, false);
    }

    async endpointCreated(name: string) {
        const { rows } = await this.oracle.queryProviderEndpoints(0, -1, -1);
        return rows.filter((row: any) => row.specifier === name);
    }

    sleep(timeout: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, timeout);
        })
    }

    getEncodedName(name: string) {
        const buffer: Serialize.SerialBuffer = new Serialize.SerialBuffer(
            {
                textEncoder: this.oracle.getNode().api.textEncoder,
                textDecoder: this.oracle.getNode().api.textDecoder
            }
        );
        buffer.pushName(name);
        return Numeric.binaryToDecimal(buffer.getUint8Array(8));
      }

    async getProvider() {
        const accounts: any = await this.node.rpc.history_get_key_accounts(ecc.privateToPublic('5KRuasWaLFJ7cSRYp3ituHXwb8dhxZXjsGdRvF3A1uWBkVcjNzQ'));
        console.log(ecc.privateToPublic('5KRuasWaLFJ7cSRYp3ituHXwb8dhxZXjsGdRvF3A1uWBkVcjNzQ'));
        if (accounts.account_names.length == 0) throw('Unable to find an accounts, check your Config variables');
        const providerAcc = new Account(accounts.account_names[0]);
		this.oracle = new Provider({
			account: providerAcc,
			node: this.node
        });
        this.subscriber = new Subscriber({
			account: providerAcc,
			node: this.node
        });
        const zapBalance = await this.node.rpc.get_currency_balance(Config.zaptokencontract, accounts.account_names[0], "TST");
        const eosBalance = await this.node.rpc.get_currency_balance("eosio.token", accounts.account_names[0], "EOS");
        console.log("Wallet contains:", eosBalance, " ", zapBalance);
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

    async getQueryId(timestamp: number, subscriber: string) {
        let queries: any[] = [];
        const encodedName = new BigNumber(this.getEncodedName(this.oracle.getAccount().name), false);
        encodedName.plus(1);
        return new Promise(async (resolve, reject) => {
            while(!queries.length) {
				await this.sleep(500);
				const res = await this.oracle.queryQueriesInfo(encodedName.minus(1).toString(), encodedName.plus(1).toString(), -1, 2);
				if (res.rows.length) {
                    queries = res.rows.filter((row: any) =>  row.subscriber === subscriber && row.timestamp === timestamp);
                    if (queries.length) {
                        resolve(queries[0].id);
                    }
                }
			}
        });
    }
    async handleQuery(queryEvent: any): Promise<void> {
        let response: string[] | number[]
        console.log('to handle:', queryEvent)
        const event: any = {
            query: queryEvent.query,
            endpoint: queryEvent.endpoint,
            subscriber: queryEvent.subscriber,
            onchain_provider: queryEvent.onchain_provider,
            timestamp: queryEvent.timestamp,
            endpointParams: queryEvent.endpointParams,
        }
        if (event.endpoint != Config.EndpointSchema.name) {
            console.log('Unable to find the callback for', event.endpoint);
            return;
        }

        event.queryId = await this.getQueryId(queryEvent.timestamp, queryEvent.subscriber);

        console.log(`Received query to ${event.endpoint} from ${event.onchainSub ? 'contract' : 'offchain subscriber'} at address ${event.subscriber}`);
        console.log(`Query ID ${event.queryId}...: "${event.query}". Parameters: ${event.endpointParams}`);
        for (let query of Config.EndpointSchema.queryList) {
            try{
              // Call the responder callback to get the data needed for this query
              let response = await getResponse(event.query,event.endpointParams)
              console.log("got response from getResponse method : ", response)

              // Send the response
              console.log("Responding to offchain subscriber : ")
                let txid = await this.oracle.respond(event.queryId, response, event.subscriber);
              console.log('Responded to', event.subscriber, "in transaction", txid.transactionHash);
            }catch(e){
              throw new Error(`Error responding to query ${event.queryId} : ${e}`)
            }
        }
    }
}
