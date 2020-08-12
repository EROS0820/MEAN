const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 

/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('boostersentrecord', new mongoose.Schema({
    from: 'number',
    to: 'number',
    amount: 'number',
    transaction_time: 'string',
}));