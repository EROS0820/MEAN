const mongoose = require('mongoose');
module.exports = mongoose.model('genealogyOrder', new mongoose.Schema({
    starter_id: Number,
    consumer_id: Number,
    seller_id: Number,
    product_id: String,
    qty: Number,
    status: {
      type: String,
      default: 'ordered'
    },
    code: {
      type: String,
      default: ''
    },
    created_date:{
        type: Date,
        default: Date.now()
    }
}));
