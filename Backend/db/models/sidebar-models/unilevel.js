const mongoose = require('mongoose');
module.exports = mongoose.model('unilevel', new mongoose.Schema({
    user_id: Number,
    ita: Number,
    profit: Number,
    add_id: Number,
    name: String,
    type: String,
    create_time: {
        type: Date,
        default: Date.now()
    }
}))
