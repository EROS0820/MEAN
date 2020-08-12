const mongoose = require('mongoose');
module.exports = mongoose.model('genealogyTree', new mongoose.Schema({
    user_id: Number,
    starter_id: Number,
    upper_id: Number,
    absolute_position: String,
    position: String,
    seller_id: {
        type: Number,
        default: 0
    },
    total_ita: {
        type: Number,
        default: 0
    },
    profit: {
        type: Number,
        default: 0
    },
    referral_profit: {
        type: Number,
        default: 0
    },
    purchase_ita: {
        type: Number,
        default: 0
    },
    total_earning: {
        type: Number,
        default: 0
    },
    current_balance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'pending'
    },
}))
