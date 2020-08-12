const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for User
let Contact = new Schema({
    email: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    created_datetime: {
        type: String,
        default: ''
    },
    read_flag: {
        type: String,
        default: 'N'
    },
    reply_message: {
        type: String,
        default: ''
    },
    replyer: {
        type: String,
        default: ''
    },
    reply_time: {
        type: String,
        default: ''
    },
    is_deleted: {
        type: String,
        default: 'N'
    }
}, { collection: 'contact' });

module.exports = mongoose.model('contact', Contact);