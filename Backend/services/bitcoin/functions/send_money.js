const PROVIDER = require('./providers');

function sendMoney(privateKey, from, to, amount) {
    return PROVIDER.sendTransaction({
        from,
        to,
        privKeyWIF: privateKey,
        btc: amount,
        dryrun: false
    });
}
module.exports = { sendMoney };