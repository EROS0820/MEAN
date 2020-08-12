const mongoose = require('mongoose');
const auoInCrease = require('mongodb-autoincrement');
/**
 * Create CART Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('cart', new mongoose.Schema({
    userid: {
        type: Number,
        default: 0
    },
    bz_pro_id: {
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
    field: 'cart_id'
}));