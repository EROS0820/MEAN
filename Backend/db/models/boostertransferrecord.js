const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 

/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('boostertransferrecord', new mongoose.Schema({
    amount: 'number',
    LCValue: 'number',
    transaction_time: 'string',
}));