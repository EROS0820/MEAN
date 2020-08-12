const mongoose = require('mongoose');

module.exports = mongoose.model('available', new mongoose.Schema({
    userid: Number,
    available_order: Number,
    available_withdrawal: Number,
    requested_order: Number,
    requested_withdrawal: Number,
    create_time: {
        type: Date,
        default: Date.now()
    },
    update_time: {
        type: Date
    }
}));