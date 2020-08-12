const bitcoin = require('bitcoinjs-lib');
const randomstring = require('randomstring');
const CONFIG = require('../../../config/config');
/**
 * Generate a random wallet with sha256
 */
function generateWallet() {
    const hash = bitcoin.crypto.sha256(Buffer.from(randomstring.generate(20)));
    const keyPair = bitcoin.ECPair.fromPrivateKey(hash, { network: CONFIG.network });
    const privateKey = keyPair.toWIF();
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: CONFIG.network });
    return { privateKey, address };
}
module.exports = {
    generateWallet
};