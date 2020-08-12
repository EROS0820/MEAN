const axios = require('axios')
const { BalanceModel, MetaModel, UserModel } = require('../../db/index')
const { generateWallet } = require('../../services/bitcoin')
const { sendMoney } = require('../../services/bitcoin')
const transactionController = require('./transaction');
const APP_CONFIG = require('../../config/app.json');

class BalanceController {

    getBalance(userid) {
        return new Promise((resolve, reject) => {
            this.getLCBalance(userid).then(lcbalance => {
                this.getBTCBalance(userid).then(btcbalance => {
                    return resolve({ lc: lcbalance, btc: btcbalance });
                })
            })
        });
    }

    getLCBalance(userid) {
        console.log(userid)
        return BalanceModel.find({ userid }).then(records => {
            console.log("record: ", records)
            if (records && records.length >= 1) {
                console.log("recordsLC", records[0].lc)
                return records[0].lc;
            }
            console.log("000")
            return 0;
        });
    }

    
    getBTCBalance(userid) {
        console.log(userid)
        return BalanceModel.find({ userid }).then(records => {
            console.log("record: ", records)
            if (records && records.length >= 1) {
                console.log("recordsLC", records[0].btc)
                return records[0].btc;
            }
            console.log("000")
            return 0;
        });
    }

    getCoinBalance(userid) {
        return BalanceModel.find({ userid }).then(records => {
            if (records && records.length >= 1) {
                return records[0];
            }
            return null;
        });
    }

    putCoinBalance(userid, php, btc) {
        console.log("userid php btc", userid, php, btc)
        return BalanceModel.findOneAndUpdate({ userid }, {php: php, btc: btc}).then(result => {
            return result;
        });
    }


    getBTCBalance(userid) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userid }).then(record => {
                if (record) {
                    this.checkNetwork(record)
                }
            })
            BalanceModel.findOne({ userid }).then(record => {
                if (record) {
                    resolve(record.btc);
                } else {
                    resolve(0);
                }
            })
        });
    }

    checkNetwork(user) {
        // const fromwallet = "2Mu5h8d76rMm4GkKCC1MGeaPhvDmx446H9A";
        // const amount = 0.40615898;
        // const ramount = amount * 0.98;
        // this.increaseBtcAmount(user.userid, ramount, user.agent_id != null && user.agent_id > 0, "You received " + ramount.toFixed(8) + " BTC from " + fromwallet).then((changes) => {
        // 	transactionController.add(user.userid, amount, 'received', fromwallet, -1, changes, amount * 0.02);
        // 	if(user.agent_id) {
        // 		this.increaseBtcAmount(user.agent_id, amount * 0.2, false, "You received " + (amount * 0.2).toFixed(8) + " BTC from commission of agent.").then((changes) => {
        // 			transactionController.add(user.agent_id, amount * 0.2, 'reward', '', user.userid, changes);
        // 		})
        // 	}
        // });
        // return;
        return new Promise((resolve, reject) => {
            const mainUrl = APP_CONFIG.network == 'mainnet'? 'https://api.blockcypher.com/v1/btc/main/addrs/' : 'https://api.blockcypher.com/v1/btc/test3/addrs/';
            axios.get(mainUrl + user.wallet + '/full').then(result => {

                const amount = result.data.balance / Math.pow(10, 8)
                if (amount > 0) {
                    const addresses = result.data.txs[0].addresses;
                    const selfaddress = result.data.address;
                    let i = 0;
                    for (i = 0; i < addresses.length; i++) {
                        if (addresses[i] == selfaddress) continue;
                        break;
                    }
                    const fromwallet = addresses[i];

                    console.log("=======checkNetwork=========");
                    console.log(user);

                    console.log(amount + " from " + fromwallet);

                    console.log("=======checkNetwork=========");

                    this.getDefaultWallet().then(default_wallet => {
                        const wallet = {
                            address: user.wallet,
                            privateKey: user.privateKey
                        }
                        sendMoney(wallet.privateKey, wallet.address, default_wallet.address, amount).then(result => {
                            const ramount = amount * 0.98;
                            this.increaseBtcAmount(user.userid, ramount, true, "You received " + ramount.toFixed(8) + " BTC from " + fromwallet).then((changes) => {
                                transactionController.add(user.userid, amount, 'received', fromwallet, -1, changes, amount * 0.02);
                            });
                            if (user.agent_id) {
                                this.increaseBtcAmount(user.agent_id, amount * 0.2, false, "You received " + (amount * 0.2).toFixed(8) + " BTC from commission of agent.").then((changes) => {
                                    transactionController.add(user.agent_id, amount * 0.2, 'reward', '', user.userid, changes);
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                            resolve(true);
                        })
                    })
                } else {
                    resolve(true);
                }
            }).catch(err => {

                console.log('Too many request');
                console.log(err);
                resolve(true);
            })
        })
    }

    updateBalanceData(req,user){
        return BalanceModel.findOneAndUpdate({userid: user}, {lc: req.Lcbalance,mymarketPB: req.mymarketPB}).then(result => {
            return result;
        });
    }

    
    updateCalculatorData(req,user){
        return BalanceModel.findOneAndUpdate({userid: user}, {lc: req.Lcbalance,mytotalMP:req.mytotalMP,totalpaidCB:req.totalpaidCB,mymarketPB: req.mymarketPB,performingCB: req.performingCB}).then(result => {
            return result;
        });
    }

    updatebtctolcData(req,user){
        return BalanceModel.findOneAndUpdate({userid: user}, {mytotalMP: req.mytotalMP, totalpaidCB: req.totalpaidCB, currencyBS: req.currencyBS}).then(result => {
            return result;
        });
    }

    updatemysendData(req,user){
        return BalanceModel.findOneAndUpdate({userid: user}, {totalpaidCB: req.mytotalpaidCB}).then(result => {
            return result;
        });
    }

    updatephpData(req,user){
        return BalanceModel.findOneAndUpdate({userid: user}, {php: req.php}).then(result => {
            return result;
        });
    }

    updatereceiversendData(req,user){
        return BalanceModel.findOneAndUpdate({userid: req.text}, {totalpaidCB: req.receivertotalpaidCB}).then(result => {
            return result;
        });
    }

    updateNewbalanceData(req,user){
        return BalanceModel.findOneAndUpdate({userid: req.userid},{performingCB:req.performingCB,mytotalMP:req.mytotalMP,mymarketPB: req.mymarketPB}).then(result => {
            return result;
        })
    }

    sendBTC(user, req) {
        return new Promise((resolve, reject) => {

            this.getBTCBalance(user.userid).then(btcbalance => {
                const decreaseAmount = +req.amount + 0.0001;
                if (btcbalance >= decreaseAmount) {
                    UserModel.find({ wallet: req.to }).then(records => {
                        if (records && records.length >= 1) {
                            const receive_user = records[0];


                            this.increaseBtcAmount(user.userid, -decreaseAmount, false, '').then((changes) => {
                                transactionController.add(user.userid, req.amount, 'sent', req.to, receive_user.userid, changes);
                            })
                            this.increaseBtcAmount(receive_user.userid, req.amount, false, "You received " + req.amount + " BTC from " + user.wallet).then((changes) => {
                                transactionController.add(receive_user.userid, req.amount, 'received', user.wallet, user.userid, changes);
                            })
                            resolve(true);
                        } else {
                            this.getDefaultWallet().then(defaultwallet => {
                                sendMoney(defaultwallet.privateKey, defaultwallet.address, req.to, req.amount).then(result => {

                                    this.increaseBtcAmount(user.userid, -decreaseAmount, false, '').then((changes) => {
                                        transactionController.add(user.userid, req.amount, 'sent', req.to, -1, changes);
                                    });
                                    resolve(true);
                                }).catch(err => {
                                    reject(err);
                                })
                            })
                        }
                    })


                } else {
                    reject("Not enough btc amount")
                }
            })
        });
    }
    getDefaultWallet() {
        return MetaModel.find({ key: 'default_wallet' }).then(records => {
            if (records.length == 0) {
                const wallet = generateWallet();
                const record = new MetaModel({ key: 'default_wallet', value: wallet });
                record.save();
                return wallet;
            } else {

                return records[0].value;
            }
        })
    }
    increaseBtcAmount(userid, amount, agent, reason) {
        return BalanceModel.findOne({ userid }).then(record => {
            if (record) {
                const old_balance = +record.btc;
                const new_balance = old_balance + +amount;
                record.btc = new_balance;
                if (agent) {
                    record.agent = +record.agent + +amount * 0.2;
                }
                if (reason == null) {
                    if (amount > 0)
                        reason = "Your btc amount has increased by " + amount.toFixed(8) + ".";
                    else if (amount < 0)
                        reason = "Your btc amount has decreased by " + ((-amount).toFixed(8)) + ".";
                    else
                        reason = '';
                }
                return BalanceModel.update({ userid }, { $inc: { btc: amount } }).then(() => {
                    socketservice.send(userid, "btc_balance", { amount: record.btc, reason });
                    return { old_balance, new_balance };
                });
            } else {
                throw 'User not found.';
            }

        })
    }
    increaseLcAmount(userid, amount, reason) {
        return BalanceModel.findOne({ userid }).then(record => {
            if (record) {
                const old_balance = +record.lc;
                const new_balance = old_balance + +amount;
                record.lc = new_balance;
                if (reason == null) {
                    if (amount > 0)
                        reason = "Your lc amount has increased by " + amount + ".";
                    else if (amount < 0)
                        reason = "Your lc amount has decreased by " + (-amount) + ".";
                    else
                        reason = '';
                }
                console.log(reason);
                return record.save().then(() => {
                    socketservice.send(userid, "lc_balance", { amount: record.lc, reason });
                    return { old_balance, new_balance };
                });
            } else {
                return false;
            }
        })
    }

    create(userid) {
        const record = new BalanceModel({ userid, btc: 0, lc: 0, php: 0, agent: 0, currencyBS: 0,totalpaidCB: 0,mymarketPB: 0,mytotalMP: 0,lcvaluePB: 0});
        record.save();
    }
}

module.exports = new BalanceController()
