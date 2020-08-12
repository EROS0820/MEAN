const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 

/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('listofbooster', new mongoose.Schema({
    userid: 'number',
    amount: 'number',
    transaction_time: 'string',
    pre_id: 'number'
}));