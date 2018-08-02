const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const Web3 = require('web3');

import { ZapBondage } from "@zapjs/bondage";
import { ZapToken } from "@zapjs/zaptoken";
import {BaseContract} from "@zapjs/basecontract";

import { join } from "path";

const INFURA_HTTP = "https://kovan.infura.io/xeb916AFjrcttuQlezyq";

const mnemonic:string = "solid giraffe crowd become skin deliver screen receive balcony ask manual current";

const BONDAGE_ADDR:string = "0xddc0923e2a63f321559c37a48f44ed74d8a93c32";

const FAUCET_ADDR:string = "0x5ea991e9c071852ae293daecea88f43ddc960743";


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

	// mint tokens to faucet, account
	await token.allocate({to: FAUCET_ADDR, amount: 1000000000, from: owner}).then((txid: any) => { 
 		console.log('Allocation to Faucet, Hash:', txid.transactionHash); 
 	});
	await token.allocate({to: owner, amount: 1000, from: owner}).then((txid: any) => { 
 		console.log('Allocation to Owner, Hash:', txid.transactionHash); 
 	});

	// approve bondage contract for the delegate bond
	await token.approve({to: BONDAGE_ADDR, amount: 100000000000000000000, from: owner}).then((txid: any) => { 
 		console.log('Approval to faucet, Hash:', txid.transactionHash); 
 	});

	process.exit(0);
	// TODO: SUPPORT DELEGATED BONDING
}

main();