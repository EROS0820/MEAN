const async = require('async');
const { TransactionModel, OrderModel } = require('../../db/index');
const BalanceController = require('./balance');

class UserController {
    getUserDetail(userid) {
        return new Promise((resolve, reject) => {
            async.parallel({
                    received_btc: (callback) => { this.getReceivedBTC(userid).then(result => callback(null, result)) },
                    sent_btc: (callback) => { this.getSentBTC(userid).then(result => callback(null, result)) },
                    reward_btc: (callback) => { this.getRewardBTC(userid).then(result => callback(null, result)) },
                    btc_balance: (callback) => { BalanceController.getBTCBalance(userid).then(result => callback(null, result)) },
                    lc_balance: (callback) => { BalanceController.getLCBalance(userid).then(result => callback(null, result)) },
                    converted_ltob: (callback) => { this.getConvertedLTOB(userid).then(result => callback(null, result)) },
                    converted_btol: (callback) => { this.getConvertedBTOL(userid).then(result => callback(null, result)) },
                    fee_ltob: (callback) => { this.getFeeLTOB(userid).then(result => callback(null, result)) },
                    fee_btol: (callback) => { this.getFeeBTOL(userid).then(result => callback(null, result)) },
                    adder: (callback) => { this.getAdder(userid).then(result => callback(null, result)) },
                    subtracter: (callback) => { this.getSubtracter(userid).then(result => callback(null, result)) },
                },
                (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
        });
    }

    getReceivedBTC(userid) {
        return new Promise((resolve, reject) => {
            TransactionModel.aggregate([
                { "$match": { "userid": +userid, "type": 'received' } },
                { "$group": { "_id": {}, "sum": { "$sum": "$amount" } } }
            ]).then((result) => {
                if (result && result.length >= 1) {
                    return resolve(result[0].sum);
                }
                resolve(0);
            });
        });
    }

    getSentBTC(userid) {
        return new Promise((resolve, reject) => {
            TransactionModel.aggregate([
                { "$match": { "userid": +userid, "type": 'sent' } },
                { "$group": { "_id": {}, "sum": { "$sum": "$amount" } } }
            ]).then((result) => {
                if (result && result.length >= 1) {
                    return resolve(result[0].sum);
                }
                resolve(0);
            });
        });
    }

    getRewardBTC(userid) {
        return new Promise((resolve, reject) => {
            TransactionModel.aggregate([
                { "$match": { "userid": +userid, "type": 'reward' } },
                { "$group": { "_id": {}, "sum": { "$sum": "$amount" } } }
            ]).then((result) => {
                if (result && result.length >= 1) {
                    return resolve(result[0].sum);
                }
                resolve(0);
            });
        });
    }

    getConvertedLTOB(userid) {
        return new Promise((resolve, reject) => {
            OrderModel.aggregate([
                { "$match": { "userid": +userid, "type": 'ltob', "status": "successful" } },
                { "$group": { "_id": {}, "sum": { "$sum": "$lcamount" } } }
            ]).then((result) => {
                if (result && result.length >= 1) {
                    return resolve(result[0].sum);
                }
                resolve(0);
            });
        });
    }

    getConvertedBTOL(userid) {
        return new Promise((resolve, reject) => {
            OrderModel.aggregate([
                { "$match": { "userid": +userid, "type": 'btol', "status": "successful" } },
                { "$group": { "_id": {}, "sum": { "$sum": "$btc_paid" } } }
            ]).then((result) => {
                if (result && result.length >= 1) {
                    return resolve(result[0].sum);
                }
                resolve(0);
            });
        });
    }

    getFeeLTOB(userid) {
        return new Promise((resolve, reject) => {
            OrderModel.aggregate([
                { "$match": { "userid": +userid, "type": 'ltob', "status": "successful" } },
                { "$group": { "_id": {}, "sum": { "$sum": "$fee" } } }
            ]).then((result) => {
                if (result && result.length >= 1) {
                    return resolve(result[0].sum);
                }
                resolve(0);
            });
        });
    }

    getFeeBTOL(userid) {
        return new Promise((resolve, reject) => {
            OrderModel.aggregate([
                { "$match": { "userid": +userid, "type": 'btol', "status": "successful" } },
                { "$group": { "_id": {}, "sum": { "$sum": "$fee" } } }
            ]).then((result) => {
                if (result && result.length >= 1) {
                    return resolve(result[0].sum);
                }
                resolve(0);
            });
        });
    }

    getAdder(userid) {
        return new Promise((resolve, reject) => {
            OrderModel.aggregate([
                { "$match": { "userid": +userid, "type": 'btol', "status": "successful" } },
                { "$group": { "_id": {}, "sum": { "$sum": "$adder" } } }
            ]).then((result) => {
                if (result && result.length >= 1) {
                    return resolve(result[0].sum);
                }
                resolve(0);
            });
        });
    }

    getSubtracter(userid) {
        return new Promise((resolve, reject) => {
            OrderModel.aggregate([
                { "$match": { "userid": +userid, "type": 'ltob', "status": "successful" } },
                { "$group": { "_id": {}, "sum": { "$sum": "$adder" } } }
            ]).then((result) => {
                if (result && result.length >= 1) {
                    return resolve(result[0].sum);
                }
                resolve(0);
            });
        });
    }


}
module.exports = new UserController();
