const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 

/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('balances', new mongoose.Schema({
    userid: 'number',
    btc: 'number',
    lc: 'number',
    php: 'number',
    agent: 'number',
    currencyBS: 'number',
    totalpaidCB: 'number',
    mytotalMP: 'number',
    mymarketPB: 'number',
    performingCB: 'number',
    create_time: {
        type: Date,
        default: Date.now()
    },
    is_deleted: {
        type: String,
        default: 'N'
    },
}));