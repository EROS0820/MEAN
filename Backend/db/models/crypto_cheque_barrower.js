const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 
const auoInCrease = require('mongodb-autoincrement');
/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('crypto_cheque_barrower', new mongoose.Schema({
    cheque_code: 'string',
    amount: 'number',
    agent_profit: 'number',
    agent_id: 'number',
    from: 'number',
    payto:'number',
    type: 'string',
    capitalId: 'string',
    status:{
        type:Boolean,
        default:false
    },
    create_time: {
        type: Date,
        default: Date.now()
    },
    releasing_time: {
        type: 'string'
    },
    accepted: {
        type: Boolean,
        default: false
    },
    declined: {
        type: Boolean,
        default: false
    },
    SPTW: 'number',
    APTW: 'number',
    T_BTC_TW: 'number',
    T_LC_TW: 'number',
    btc_balance: 'number',
    lc_balance: 'number',
    undue_cheque: 'number'
}).plugin(auoInCrease.mongoosePlugin, {
    field: 'cheque_no'
}));