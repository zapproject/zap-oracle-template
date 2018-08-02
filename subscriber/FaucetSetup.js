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
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const Web3 = require('web3');
const bondage_1 = require("@zapjs/bondage");
const zaptoken_1 = require("@zapjs/zaptoken");
const path_1 = require("path");
const INFURA_HTTP = "https://kovan.infura.io/xeb916AFjrcttuQlezyq";
const mnemonic = "solid giraffe crowd become skin deliver screen receive balcony ask manual current";
const BONDAGE_ADDR = "0xddc0923e2a63f321559c37a48f44ed74d8a93c32";
const FAUCET_ADDR = "0x5ea991e9c071852ae293daecea88f43ddc960743";
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
        // mint tokens to faucet, account
        yield token.allocate({ to: FAUCET_ADDR, amount: 1000000000, from: owner }).then((txid) => {
            console.log('Allocation to Faucet, Hash:', txid.transactionHash);
        });
        yield token.allocate({ to: owner, amount: 1000, from: owner }).then((txid) => {
            console.log('Allocation to Owner, Hash:', txid.transactionHash);
        });
        // approve bondage contract for the delegate bond
        yield token.approve({ to: BONDAGE_ADDR, amount: 100000000000000000000, from: owner }).then((txid) => {
            console.log('Approval to faucet, Hash:', txid.transactionHash);
        });
        process.exit(0);
        // TODO: SUPPORT DELEGATED BONDING
    });
}
main();
