const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth');
const orderController = require('./controllers/order');
const transactionController = require('./controllers/transaction');
const adderController = require('./controllers/adder');
const jwtService = require('./middlewares/jwt');
const userController = require('./controllers/user');

router.post('/login', (req, res) => {
    console.log('Admin Login: ' + req.body.email + " " + req.body.password);
    authController.adminlogin(req.body).then((result) => {
        res.json({
            status: 'success',
            payload: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            payload: err
        });
    });
});

router.get('/getAllOrders', jwtService.checkUser(), (req, res) => {
    orderController.getAllOrders().then(result => {
        res.send(result);
    });
});

router.get('/getBTCReceived', jwtService.checkUser(), (req, res) => {
    transactionController.getBTCReceivedAdmin().then(result => {
        res.send(result);
    });
});

router.get('/getBTCSent', jwtService.checkUser(), (req, res) => {
    transactionController.getBTCSentAdmin().then(result => {
        res.send(result);
    });
});

router.get('/getAdder', (req, res) => {
    adderController.getAdder().then(result => {
        res.json({
            status: 'success',
            payload: result
        });
    });
});

router.get('/getSubtracter', (req, res) => {
    adderController.getSubtracter().then(result => {
        res.json({
            status: 'success',
            payload: result
        });
    });
});

router.post('/searchUsers', jwtService.checkUser(), (req, res) => {
    authController.searchUsers(req.body.search).then(result => {
        res.send(result);
    });
});

router.get('/getUserDetail/:userid', jwtService.checkUser(), (req, res) => {
    userController.getUserDetail(req.params.userid).then(result => {
        res.send(result);
    });
});

router.get('/getMultiplier', jwtService.checkUser(), (req, res) => {
    adderController.getMultiplier().then(result => {
        res.send(result);
    });
});

router.post('/setMultiplier', jwtService.checkUser(), (req, res) => {
    adderController.setMultiplier(req.body).then(result => {
        res.send({
            status: 'success'
        });
    }).catch(err => {
        res.json({
            status: 'error',
            payload: err
        });
    });
});

// get Bazaar Value Settings
router.get('/getBazaarValueSettings', jwtService.checkUser(), (req, res) => {
    adderController.getBazaarValueSettings().then(result => {
        res.send(result);
    });
});

// set Bazaar Value Settings
router.post('/setBazaarValueSettings', jwtService.checkUser(), (req, res) => {
    adderController.setBazaarValueSettings(req.body).then(result => {
        res.send({
            status: 'success'
        });
    }).catch(err => {
        res.json({
            status: 'error',
            payload: err
        });
    });
});

module.exports = router;