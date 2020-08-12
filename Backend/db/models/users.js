const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 
const auoInCrease = require('mongodb-autoincrement');
/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('users', new mongoose.Schema({
    first_name: 'string',
    last_name: 'string',
    agent_id: {
        type: Number,
        default: 6
    },
    email: 'string',
    phonenumber: 'string',
    password: 'string',
    wallet: 'string',
    privateKey: 'string',
    user_country: 'string',
    currency_val: 'string',
    bz_name: 'string',
    city: 'string',
    address: 'string',
    shop_rule: 'string',
    bz_photo: 'string',
    bz_flag: {
        type: Number,
        default: 0
    },
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
}).plugin(auoInCrease.mongoosePlugin, {
    field: 'userid'
}));