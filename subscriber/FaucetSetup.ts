
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const Web3 = require('web3');

import { ZapBondage } from "@zapjs/bondage";
import { ZapToken } from "@zapjs/zaptoken";
import {BaseContract} from "@zapjs/basecontract";
const {toBN, utf8ToHex} = require("web3-utils");

import { join } from "path";

const INFURA_HTTP = "wss://kovan.infura.io/ws/xeb916AFjrcttuQlezyq";

const mnemonic:string = "solid giraffe crowd become skin deliver screen receive balcony ask manual current";

const BONDAGE_ADDR:string = "0xc7a1f161af0c67526f957436aff65e3e7b9e65f3";

const FAUCET_ADDR:string = "0xf6f8db262add4341c10513dca41be9b64ae80e23";
const ORACLE_ADDR:string = "0x3fda6E7e9E5AEca8c6B3CD8c32079fB97a4cb221";

async function main() {
	const web3: any = new Web3(new HDWalletProviderMem(mnemonic, INFURA_HTTP));	

	const accounts: string[] = await web3.eth.getAccounts();
	const owner: string = accounts[0];

	const options: any = {
		artifactsDir: join(__dirname, '../', 'node_modules/@zapjs/artifacts/contracts/'),
		networkId: await web3.eth.net.getId(),
		networkProvider: web3.currentProvider,
		owner: owner
	};

	const bondage:ZapBondage = new ZapBondage(options);
	const token:ZapToken = new ZapToken(options);

	console.log("Running faucet setup from: " + owner, "to", FAUCET_ADDR);

	// mint tokens to faucet, account (INTEGER ZAP)
	await token.allocate({to: FAUCET_ADDR, amount: toBN(1e18).imul(toBN(1000)), from: owner}).then((txid: any) => { 
 		console.log('Allocation to Faucet, Hash:', txid.transactionHash); 
 	});
	await token.allocate({to: owner, amount: toBN(1e18).imul(toBN(1000)), from: owner}).then((txid: any) => { 
 		console.log('Allocation to Owner, Hash:', txid.transactionHash); 
 	});

	// approve bondage contract for the delegate bond
	await token.approve({to: BONDAGE_ADDR, amount: toBN(1e18).imul(toBN(1000)), from: owner}).then((txid: any) => { 
 		console.log('Approval to Faucet, Hash:', txid.transactionHash); 
 	});

	// delegated bond to the contract
	await bondage.delegateBond({provider: ORACLE_ADDR, endpoint: "zapprice", dots: 100, subscriber: FAUCET_ADDR, from: owner}).then((txid: any) => { 
 		console.log('Delegated bond, Hash:', txid.transactionHash); 
 	});
	process.exit(0);
}

main();