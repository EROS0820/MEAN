const express = require('express');
const forgotRoutes = express.Router();

var User = require('../db/models/users');

// register user
forgotRoutes.route('').post(function(req, res) {
    User.findOne({
        'email': req.body.email
    }, function(err, user) {
        if (err) {
            res.status(400).send("Forgot Password Recovery Exception.");
            console.log(err);
        }
        if (user) {
            res.status(200).json({ 'result': 'Check Your Email Inbox.' });
            // sending password to user eamil inbox
        }
        if (!user) {
            res.status(200).json({ 'invalid': 'Email Address Not Found.' });
        }
    });
});

module.exports = forgotRoutes;