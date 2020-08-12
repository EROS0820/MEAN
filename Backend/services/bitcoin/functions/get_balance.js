/**
 * Haven't USE this function
 */
const PROVIDER = require('./providers');

function getBalance(address) {
    return PROVIDER.getBalance(address);
}

module.exports = { getBalance };