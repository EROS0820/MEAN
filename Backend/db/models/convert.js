const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 

/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('convert', new mongoose.Schema({
    userid: 'number',
    btcphp: 'number',
    lcphp: 'number',
    amountPHP: 'number',
    receivableBTC: 'number',
    previousBalance: 'number',
    presentBalance: 'number',
    btcPreviousBalance: 'number',
    btcCurrentBalance: 'number',
    create_time: {
        type: Date,
        default: Date.now()
    }
}));