const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 
const auoInCrease = require('mongodb-autoincrement');
/**
 * Create BZPRODUCTS Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('bzproducts', new mongoose.Schema({
    userid: {
        type: Number,
        default: 0
    },
    bp_name: {
        type: String,
        default: ''
    },
    availability: {
        type: Number,
        default: 5
    },
    initial_cc_price: {
        type: Number,
        default: 0
    },
    control_cc_price: {
        type: Number,
        default: 0
    },
    initial_lc_price: {
        type: Number,
        default: 0
    },
    control_lc_price: {
        type: Number,
        default: 0
    },
    lc_cc: {
        type: Number,
        default: 0
    },
    lc_btc: {
        type: Number,
        default: 0
    },
    assigned_savings: {
        type: Number,
        default: 18
    },
    agent_savings: {
        type: Number,
        default: 1
    },
    personal_savings: {
        type: Number,
        default: 0
    },
    indirect_savings: {
        type: Number,
        default: 8
    },
    total_product_costs: {
        type: Number,
        default: 0
    },
    total_indirect_savings: {
        type: Number,
        default: 0
    },
    product_description: {
        type: String,
        default: ''
    },
    bzp_photo: {
        type: String,
        default: ''
    },
    bzp_type: {
        type: String,
        default: 'regular'
    },
    user_country: {
        type: String,
        default: ''
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
    field: 'bz_pro_id'
}));