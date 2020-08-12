const mongoose = require('mongoose');
module.exports = mongoose.model('encashment', new mongoose.Schema({
    user_id: Number,
    type: String,
    amount: Number,
    receivable_lc: Number,
    total_lc: Number,
    create_time: {
        type: Date,
        default: Date.now()
    },
    update_time: {
        type: Date
    }
}))
