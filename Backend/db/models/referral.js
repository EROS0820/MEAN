const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 

/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('referral', new mongoose.Schema({
    userid: 'number',
    referraledId: 'number',
    type: 'string',
    ita: 'number',
    profit: 'number',
    amount: 'number',
    create_time: {
        type: Date,
        default: Date.now()
    }
}));