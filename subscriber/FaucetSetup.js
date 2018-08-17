"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const Web3 = require('web3');
const bondage_1 = require("@zapjs/bondage");
const zaptoken_1 = require("@zapjs/zaptoken");
const { toBN, utf8ToHex } = require("web3-utils");
const path_1 = require("path");
const INFURA_HTTP = "wss://kovan.infura.io/ws/xeb916AFjrcttuQlezyq";
const mnemonic = "solid giraffe crowd become skin deliver screen receive balcony ask manual current";
const BONDAGE_ADDR = "0xc7a1f161af0c67526f957436aff65e3e7b9e65f3";
const FAUCET_ADDR = "0xc52e9f6819cd0af04619aa07bb73634ff0ce7b13";
const ORACLE_ADDR = "0x3fda6E7e9E5AEca8c6B3CD8c32079fB97a4cb221";
async function main() {
    const web3 = new Web3(new HDWalletProviderMem(mnemonic, INFURA_HTTP));
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const options = {
        artifactsDir: path_1.join(__dirname, '../', 'node_modules/@zapjs/artifacts/contracts/'),
        networkId: await web3.eth.net.getId(),
        networkProvider: web3.currentProvider,
        owner: owner
    };
    const bondage = new bondage_1.ZapBondage(options);
    const token = new zaptoken_1.ZapToken(options);
    console.log("Running faucet setup from: " + owner, "to", FAUCET_ADDR);
    // fund the faucet
    await token.allocate({ to: FAUCET_ADDR, amount: toBN(1e18).imul(toBN(10000000)), from: owner }).then((txid) => {
        console.log('Allocation to Faucet, Hash:', txid.transactionHash);
    });
    /*
    // fund the owner/bonder
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
    });*/
    process.exit(0);
}
main();
