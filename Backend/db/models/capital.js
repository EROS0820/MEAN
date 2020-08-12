const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 

/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('capital', new mongoose.Schema({
    userid: 'number',
    amount: 'number',
    profit: 'number',
    days: 'number',
    total_fund: 'number',
    btc_price: 'number',
    btc_fund: 'number',
    maturity_time: Date,
    pending: {
        type: Boolean,
        default: false
    },
    create_time: {
        type: Date,
        default: Date.now()
    }
}));