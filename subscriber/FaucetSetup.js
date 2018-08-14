"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const Web3 = require('web3');
const bondage_1 = require("@zapjs/bondage");
const zaptoken_1 = require("@zapjs/zaptoken");
const path_1 = require("path");
const INFURA_HTTP = "wss://kovan.infura.io/ws/xeb916AFjrcttuQlezyq";
const mnemonic = "solid giraffe crowd become skin deliver screen receive balcony ask manual current";
const BONDAGE_ADDR = "0xc7a1f161af0c67526f957436aff65e3e7b9e65f3";
const FAUCET_ADDR = "0x25eaf1ff3107bf9c98c0c6de0185bca637ed9265";
const ORACLE_ADDR = "0x3fda6E7e9E5AEca8c6B3CD8c32079fB97a4cb221";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const web3 = new Web3(new HDWalletProviderMem(mnemonic, INFURA_HTTP));
        const accounts = yield web3.eth.getAccounts();
        const owner = accounts[0];
        const options = {
            artifactsDir: path_1.join(__dirname, '../', 'node_modules/@zapjs/artifacts/contracts/'),
            networkId: yield web3.eth.net.getId(),
            networkProvider: web3.currentProvider,
            owner: owner
        };
        const bondage = new bondage_1.ZapBondage(options);
        const token = new zaptoken_1.ZapToken(options);
        console.log("Running faucet setup from: " + owner, "to", FAUCET_ADDR);
        // mint tokens to faucet, account (INTEGER ZAP)
        yield token.allocate({ to: FAUCET_ADDR, amount: 10000, from: owner }).then((txid) => {
            console.log('Allocation to Faucet, Hash:', txid.transactionHash);
        });
        yield token.allocate({ to: owner, amount: 10000, from: owner }).then((txid) => {
            console.log('Allocation to Owner, Hash:', txid.transactionHash);
        });
        // approve bondage contract for the delegate bond
        yield token.approve({ to: BONDAGE_ADDR, amount: 10000, from: owner }).then((txid) => {
            console.log('Approval to Faucet, Hash:', txid.transactionHash);
        });
        // delegated bond to the contract
        yield bondage.delegateBond({ provider: ORACLE_ADDR, endpoint: "zapprice", dots: 10, subscriber: FAUCET_ADDR, from: owner }).then((txid) => {
            console.log('Delegated bond, Hash:', txid.transactionHash);
        });
        process.exit(0);
    });
}
main();
