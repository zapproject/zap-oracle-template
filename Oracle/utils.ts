import { Serialize, Numeric } from 'eosjs';
const hdkey = require('hdkey');
const wif = require('wif');
const bip39 = require('bip39');

export function getEncodedName(name: string, oracle: any) {
    const buffer: Serialize.SerialBuffer = new Serialize.SerialBuffer(
        {
            textEncoder: oracle.getNode().api.textEncoder,
            textDecoder: oracle.getNode().api.textDecoder
        }
    );
    buffer.pushName(name);
    return Numeric.binaryToDecimal(buffer.getUint8Array(8));
}

export function sleep(timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timeout);
    })
}

export function getPrivateKey(mnemonic: string) {
    const seed = bip39.mnemonicToSeedHex(mnemonic)
        const master = hdkey.fromMasterSeed(new Buffer(seed, 'hex'))
        const nodem = master.derive("m/44'/194'/0'/0/0")
        return  wif.encode(128, nodem._privateKey, false);
}