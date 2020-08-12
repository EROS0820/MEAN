const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 
const auoInCrease = require('mongodb-autoincrement');
/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('orders', new mongoose.Schema({
    rate: 'number',
    lcamount: 'number',
    userid: 'number',
    type: 'string',
    btc_paid: 'number',
    btc_receive: 'number',
    date: 'date',
    status: 'string',
    fee: 'number',
    paid: 'string',
    adder: 'number',
    reward: {
	type: String,
	default: 'unreward'
    },
    shop_id: {
        type: Number
    },
    bz_pro_id: {
        type: Number
    },
    quantity: {
        type: Number
    },
    buy_controlled_cc_price: {
        type: Number
    },
    total_payable_cc_price: {
        type: Number
    },
    buy_controlled_lc_price: {
        type: Number
    },
    tps: {
        type: Number
    },
    tas: {
        type: Number
    },
    lctobtc: {
        type: Number
    },
    claim: {
        type: String
    },
    update_time: {
        type: Date
    },
    is_deleted: {
        type: String,
        default: 'N'
    },
}).plugin(auoInCrease.mongoosePlugin, {
    field: 'orderid'
}));