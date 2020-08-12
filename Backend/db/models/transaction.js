const mongoose = require('mongoose');
/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('transaction', new mongoose.Schema({
    amount: 'number',
    userid: 'number',
    type: 'string',
    date: 'date',
    wallet: 'string',
    lcamount: 'number',
    rate: 'number',
    userB: 'number',
    old: 'number',
    new: 'number',
    fee: 'number',
    create_time: {
        type: Date,
        default: Date.now()
    },
    update_time: {
        type: Date
    },
    is_deleted: {
        type: String,
        default: 'N'
    },
}));