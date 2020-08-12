const express = require('express');
const contactRoutes = express.Router();
const moment = require('moment');

var Contact = require('../db/models/contact');

// register user
contactRoutes.route('').post(function(req, res) {
    var contact = new Contact(req.body);
    contact.created_datetime = moment().format('YYYY-MM-DD HH:MM:SS').toString();
    contact.save().then(contact => {
        res.status(200).json({ 'result': 'Message sending success.' });
    }).catch(err => {
        res.status(400).send("Unable to save contact data.");
    });
});

module.exports = contactRoutes;