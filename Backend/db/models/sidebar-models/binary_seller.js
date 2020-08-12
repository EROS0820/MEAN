const mongoose = require('mongoose');
module.exports = mongoose.model('binarySeller', new mongoose.Schema({
    userid: Number,
    image: String,
    product_name: String,
    seller_price: Number,
    availability:Number,
    market_price: Number,
    product:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'genealogyOrder'
    }],
    upload_date:{
        type: Date,
        default: Date.now()
    }
}));

