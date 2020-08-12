const mongoose = require('mongoose');
module.exports = mongoose.model('balancePlus', new mongoose.Schema({
    
    user_id: Number,
    balance_plus: Number,
    ita: Number,
    add_id: Number,
    type: String
}))
