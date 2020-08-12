// Import Middleware
const validate = require('./middlewares/validate');
const jwtService = require('./middlewares/jwt');
const { Router } = require('express');
// Import controller
const authController = require('./controllers/auth');
const dashboardController = require('./controllers/dashboard');
const balanceController = require('./controllers/balance');
const orderController = require('./controllers/order');
const cryptoChequeController = require('./controllers/crypto-cheque');
const transactionController = require('./controllers/transaction');
const availableController = require('./controllers/available');
const convertController = require('./controllers/convert');
const referralController = require('./controllers/referral');
const capitalController = require('./controllers/capital');
const currencyBSController = require('./controllers/currencyBS');
const ListofboosterController = require('./controllers/listofbooster');
const BoostertransferrecordController = require('./controllers/boostertransferrecord');
const BoostersentrecordController = require('./controllers/boostersentrecord');

const { UserModel, BzproductsModel, CartModel, OrderModel, BalanceModel, MetaModel } = require('../db/index');
const router = Router();
// Load validation middleware
validate(router);

// file upload
const upload = require('./middlewares/uploadMiddleware');
const path = require('path');
const Resize = require('../Resize');
// const Coins = require("coins-ph");

// let client = new Coins({
//     key: 'JV5sSoldrw8vFTVQdmGedlvd8aJQ5M8GRlJ2ivfq', 
//     secret: 'QXt1mSC2VnX6deQzqAYfUEo7zIXceeu4nUYQUJWUMegEmNOILt'

//     // This is optional
//   , host: "https://coins.ph/"
// });

router.post('/barrower', (req,res)=> {
        cryptoChequeController.borrower(req.body)
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})

router.post('/userlist', (req,res)=> {
        cryptoChequeController.getbalance(req.body)
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})

router.get('/barrower', (req,res)=> {
        cryptoChequeController.getBorrower()
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})

router.get('/barrowerPending/:id', (req,res)=> {
    cryptoChequeController.getBorrowerPending(req.params.id)
    .then(result=> {
        res.json({
            status:"success",
            response:result
        })
    })
    .catch(err => {
        res.json({
            status:'error',
            error:err
        })
    })
})

router.get('/barrowerById/:id', (req,res)=> {
    cryptoChequeController.getbarrowerById(req.params.id)
    .then(result=> {
        res.json({
            status:"success",
            response:result
        })
    })
    .catch(err => {
        res.json({
            status:'error',
            error:err
        })
    })
})

router.get('/acceptbarrower/:chequeid', (req,res)=> {
    console.log(req.params,'sas'); 
        cryptoChequeController.acceptBorrower(req.params)
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})

router.get('/declinebarrower/:chequeid', (req,res)=> {
    console.log(req.params,'sas'); 
        cryptoChequeController.declineBorrower(req.params)
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})
router.get('/ledger/:userid', (req,res)=> {
    console.log(req.params);
        cryptoChequeController.getLedger(req.params)
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})

router.get('/txhistory/:userid', (req,res)=> {
    console.log(req.params);
        cryptoChequeController.getTxHistory(req.params)
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})

router.post('/increase_crypto_btc',(req,res)=> {
            cryptoChequeController.increaseBTCForPaid(req.body)
        .then(result=> {
    cryptoChequeController.changeStatus(req.body.chequeid);
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})

router.post('/decrease_crypto_btc',(req,res)=> {
    console.log(req.body,'decrease hit');
            cryptoChequeController.decreaseBTCFromSender(req.body)
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})


router.delete('/barrower/:id', (req,res)=> {
    console.log(req.params,'ssss'); 
        cryptoChequeController.deleteBorrower(req.params)
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})

router.delete('/barrowerCapital/:id', (req,res)=> {
    console.log(req.params,'ssss'); 
        cryptoChequeController.deleteBorrowerCapital(req.params)
        .then(result=> {
            res.json({
                status:"success",
                response:result
            })
        })
        .catch(err => {
            res.json({
                status:'error',
                error:err
            })
        })
})

// bazaar image upload and user model bz_photo field update
router.post('/images/bazaar/:id', upload.single('bz_photo'), async function(req, res) {
    const imagePath = path.join(__dirname, '../../html/assets');
    // const imagePath = path.join(__dirname, '../../front1/src/assets');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.json({
            status: 'error',
            payload: 'Please provide an image'
        });
    }
    const filename = await fileUpload.save(req.file.buffer);
    authController.bazaarImage(req.params.id, filename)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

// bazaar product image upload and return image file name
router.post('/images/bazaarProd', upload.single('bzp_photo'), async function(req, res) {
    const imagePath = path.join(__dirname, '../../html/assets');
    // const imagePath = path.join(__dirname, '../../front1/src/assets');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.status(401).json({ error: 'Please provide an image' });
    }
    const filename = await fileUpload.save(req.file.buffer);
    return res.status(200).json({ name: filename });
});

router.get('/register/:email', (req, res) => {
    authController.emailExist(req.params.email)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

router.post('/register', (req, res) => {
    authController.register(req.body)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

//Login API
router.post('/login', (req, res) => {
    authController.login(req.body)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

//Analytics API
router.get('/analytics', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    dashboardController.analytics()
        .then(result => res.json({
            status: 'success',
            payload: result
        }))
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

//Send money API
router.post('/send', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    balanceController.sendBTC(req.user, req.body).then(result => {
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

router.post('/calculator', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    balanceController.updateCalculatorData(req.body,req.user.userid).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/currencyBS', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    currencyBSController.saveCurrency(req.body.currencyBS,req.user.userid).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/paidrequest', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    orderController.savePaid(req.body,req.user.userid).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/btctolcchange', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    balanceController.updatebtctolcData(req.body,req.user.userid).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/updatesenddata', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    console.log("FFFFFFFFFFFFFFFF",req.body)
    balanceController.updatemysendData(req.body,req.user.userid).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
    balanceController.updatereceiversendData(req.body,req.user.userid).then(result => {
        res.json({
            status: 'success',
            loaddatas: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddatas: err
        });
    });
});

router.post('/updatesuccessfulrecord', jwtService.checkUser() /* Required logged user */ , (req, res) => {
console.log("body",req.body)
    balanceController.updateNewbalanceData(req.body,req.user.userid).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/updatephpdata', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    balanceController.updatephpData(req.body,req.user.userid).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/transfer', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    balanceController.updateBalanceData(req.body,req.user.userid).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/listofbooster', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    ListofboosterController.saveBooster(req.body.id,req.body.amount,req.body.time,req.body.pre_id).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/boostersentrecord', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    BoostersentrecordController.saveSentbooster(req.body.from,req.body.to,req.body.amount,req.body.time).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/boostertransferrecord', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    BoostertransferrecordController.saveTransferbooster(req.body.amount,req.body.LCValue,req.body.time).then(result => {
        res.json({
            status: 'success',
            loaddata: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            loaddata: err
        });
    });
});

router.post('/recordOrder', jwtService.checkUser(), (req, res) => {
    orderController.add(req.body, req.user.userid).then(result => {
        if (result == true) {
            res.json({
                status: 'success'
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(400).json({
            status: 'error',
            payload: err
        });
    });
});

router.post('/cancelOrder', jwtService.checkUser(), (req, res) => {
    orderController.cancel(req.body).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            payload: err
        });
    });
});

router.get('/getLCPrice', jwtService.checkUser(), (req, res) => {
    orderController.getLCPrice().then(result => {
        res.send(result);
    });
});

router.get('/getBalance', jwtService.checkUser(), (req, res) => {
    balanceController.checkNetwork(req.user).then(result => {
        res.send(result);
    });
});

router.get('/getOpenOrders', jwtService.checkUser(), (req, res) => {
    orderController.getOpenOrders(req.user.userid).then(result => {
        res.send(result);
    });
});

router.get('/getSuccessfulOrders', jwtService.checkUser(), (req, res) => {
    console.log("reqBody: ", req)
    orderController.getSuccessOrders(req.user.userid).then(result => {
        res.send(result);
    });
});
router.get('/getSuccessfulProductsOrders', jwtService.checkUser(), (req, res) => {
    orderController.getSuccessfulProductsOrders(req.user.userid).then(result => {
        res.send(result);
    });
});


router.get('/getAllTransactions', jwtService.checkUser(), (req, res) => {
    transactionController.getAllTransactions(req.user.userid).then(result => {
        res.send(result);
    });
});

router.get('/getReferredCount', jwtService.checkUser(), (req, res) => {
    authController.getReferredCount(req.user.userid).then(result => {
        res.send({
            result
        });
    }).catch(err => {
        console.log('err');
        console.log(err);
    });
});

router.get('/getLCBalance', jwtService.checkUser(), (req, res) => {
    authController.LCBalance(req.user.userid).then(result => {
        res.send({
            result
        });
    }).catch(err => {
        console.log('err');
        console.log(err);
    });
});

router.get('/getEverybalance', jwtService.checkUser(), (req, res) => {
    authController.EveryBalance(req.user.userid).then(result => {
        res.send({
            result
        });
    }).catch(err => {
        console.log('err');
        console.log(err);
    });
});

router.get('/getcurrencyBS', jwtService.checkUser(), (req, res) => {
    currencyBSController.getCurrencydata(req.user.userid).then(result => {
        res.send({
            result
        });
    }).catch(err => {
        console.log('err');
        console.log(err);
    });
});

router.post('/getothereid', jwtService.checkUser(), (req, res) => {

    authController.getOtherid(req.body,req.user.userid).then(result => {
        res.send({
            result
        });
    }).catch(err => {
        console.log('err');
        console.log(err);
    });
});

router.get('/getListofboosterdata', jwtService.checkUser(), (req, res) => {
    ListofboosterController.getboosterdata(req.user.userid).then(result => {
        res.send({
            result
        });
    }).catch(err => {
        console.log('err');
        console.log(err);
    });
});

router.get('/getBoostertransferrecord', jwtService.checkUser(), (req, res) => {
    BoostertransferrecordController.gettransferboosterdata().then(result => {
        res.send({
            result
        });
    }).catch(err => {
        console.log('err');
        console.log(err);
    });
});

router.get('/getBoostersentrecord', jwtService.checkUser(), (req, res) => {
    BoostersentrecordController.getsentboosterdata().then(result => {
        res.send({
            result
        });
    }).catch(err => {
        console.log('err');
        console.log(err);
    });
});

router.get('/getConversionLimit', jwtService.checkUser(), (req, res) => {
    orderController.getConversionLimit(req.user.userid).then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/getBTCStocks', jwtService.checkUser(), (req, res) => {
    orderController.getStocks().then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/getDecimalEditing', jwtService.checkUser(), (req, res) => {
    orderController.getDecimalEditing().then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/reset', (req, res) => {
    dashboardController.reset().then(() => {
        res.send({
            status: 'success',
            payload: 'The system has been reset successfully.'
        });
    }).catch(err => {
        res.send({
            status: 'error',
            payload: err
        });
    });
});

router.get('/getLcBalance/:id', (req, res) => {
    console.log("Id", req.params.id)
    balanceController.getLCBalance(req.params.id).then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/getBtcBalance/:id', (req, res) => {
    console.log("Id", req.params.id)
    balanceController.getBTCBalance(req.params.id).then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/getCoinBalance/:id', (req, res) => {
    console.log("Id", req.params.id)
    balanceController.getCoinBalance(req.params.id).then(result => {
        res.send({
            value: result
        });
    });
});

router.post('/putCoinBalance', (req, res) => {
    balanceController.putCoinBalance(req.body.userid, req.body.phpBalance, req.body.btcBalance).then(result => {
        res.send({
            value: result
        });
    });
});

router.post('/saveBalance', (req, res) => {
    console.log("btcPreviousBalance; ", req.body.btcPreviousBalance)
    convertController.saveBalance(
        req.body.userid, 
        req.body.btcphp, 
        req.body.lcphp,
        req.body.amountPHP,
        req.body.receivableBTC,
        req.body.previousBalance,
        req.body.presentBalance,
        req.body.btcPreviousBalance,
        req.body.btcCurrentBalance
    ).then(result => {
        res.send({
            value: result
        });
    });
});

router.post('/saveCapital', (req, res) => {
    capitalController.saveCapital(
        req.body.userid, 
        req.body.amount, 
        req.body.profit,
        req.body.days,
        req.body.total_fund,
        req.body.btc_price,
        req.body.btc_fund,
        req.body.maturity_time,
    ).then(result => {
        res.send({
            value: result
        });
    });
});

router.post('/updatePending', (req, res) => {
    capitalController.updatePending(
        req.body._id, 
        req.body.pending
    ).then(result => {
        res.send({
            value: result
        });
    });
});

router.post('/deleteCapital', (req, res) => {
    capitalController.deleteCapital(
        req.body._id
    ).then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/getCapital', (req, res) => {
    capitalController.getCapital().then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/getConvertBalance/:id', (req, res) => {
    convertController.getBalance(req.params.id).then(result => {
        res.send({value: result});
    });
});

router.post('/saveReferral', (req, res) => {
    referralController.saveReferral(req.body.userid, req.body.type, req.body.ita, req.body.referraledId, req.body.amount)
});

router.get('/getReferral/:id', (req, res) => {
    console.log("Id", req.params.id)
    referralController.getReferral(req.params.id).then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/getBazaarInfo/:id', (req, res) => {
    authController.getBazaarInfo(req.params.id).then(result => {
        res.send(result);
    });
});

// create bazaar = update user collection
router.post('/bazaarCreate/:id', (req, res) => {
    authController.bazaarCreate(req.params.id, req.body)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

// create bazaar product
router.post('/bzprodCreate/:id', (req, res) => {
    authController.bzprodCreate(req.params.id, req.body)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

router.get('/getBazaars/:country', (req, res) => {
    UserModel.find({
        user_country: req.params.country,
        bz_flag: 1
    }).exec(function(err, bazaars) {
        if (err) {
            console.log(err);
        } else {
            res.json(bazaars);
        }
    });
});

router.get('/getBazaarProducts/:userid', (req, res) => {
    BzproductsModel.find({
        userid: req.params.userid,
        is_deleted: 'N'
    }).exec(function(err, bazaarproducts) {
        if (err) {
            console.log(err);
        } else {
            res.json(bazaarproducts);
        }
    });
});

// refillable products getting
router.post('/getRefillableProducts', jwtService.checkUser(), (req, res) => {
    BzproductsModel.find({
        userid: req.body.userid,
        is_deleted: 'N',
        availability: { $lte: req.body.refillProductAvailavility }
    }).exec(function(err, refillable) {
        if (err) {
            console.log(err);
        } else {
            res.json(refillable);
        }
    });
});

// get User BTC Conversinon Submitted Value
router.get('/getBtcConversionSubmitted/:id', (req, res) => {
    orderController.getBtcConversionSubmitted(req.params.id).then(result => {
        res.json(result);
    });
});
// get Qbonus
router.get('/getQBonus', (req, res) => {
    orderController.getQBonus().then(result => {
        res.json(result);
    });
});

// balance data for table
router.get('/getQualifiersData', (req, res) => {
    OrderModel.aggregate([{
                $match: {
                    type: "btol",
                    status: "successful",
                    reward: "unreward"
                }
            },
            {
                $group: {
                    _id: "$userid",
                    //userid: "$userid",
                    btcpaid: { $sum: "$btc_paid" }
                }
            },
            {
                $lookup: {
                    from: "balances",
                    localField: "_id",
                    foreignField: "userid",
                    as: "qdata"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$qdata", 0] }, "$$ROOT"] } }
            },
            { $project: { qdata: 0 } }
        ])
        .exec(function(err, response) {
            if (err) {
                console.log('getQualifiersData error ' + err);
            } else {
                res.send(response);
            }
        })
});

// set reward bonus
router.post('/setQBonusEachUser', (req, res) => {
    var qualifiers = req.body.qualifiers;

    for (let i = 0; i < Object.keys(qualifiers).length; i++) {
        let q = qualifiers[i];
        BalanceModel.updateMany({
            userid: q.userid
        }, {
            $set: {
                lc: q.lc
            }
        }).then(() => {});

        OrderModel.updateMany({
            userid: q.userid,
            type: 'btol',
            status: "successful"
        }, {
            $set: { reward: 'reward' }
        }).then(() => {
            if (i === Object.keys(qualifiers).length - 1)
                res.send(true);
        })
    }
});

router.post('/setQBonus', jwtService.checkUser(), (req, res) => {
    const amount = parseFloat(req.body.amount);
    socketservice.sendAll("q_bonus", amount);
    MetaModel.update({
        key: 'QBonus',
        value: amount
    }).then(() => {
        res.json(true);
    });
});

// check user's cart record   
function findCartRecord(userid, pro_id) {
    return CartModel.findOne({
        userid: userid,
        bz_pro_id: pro_id,
        is_deleted: 'N'
    });
}

// add to cart product
router.post('/addToCart', (req, res) => {
    findCartRecord(req.body.userid, req.body.bz_pro_id).then(record => {
        if (record) {
            res.json({
                status: 'already',
                payload: 'Already exist in your cart.'
            });
        } else {
            authController.addToCart(req.body)
                .then(result => {
                    res.json({
                        status: 'success',
                        payload: result
                    });
                })
                .catch(err => res.status(400).json({
                    status: 'error',
                    payload: err
                }));
        }
    });
});

// remove product from cart
router.post('/removeProductFromCart', (req, res) => {
    const cart_id = parseInt(req.body.cart_id);
    const filter = { cart_id: cart_id };
    const update = { is_deleted: 'Y' };
    CartModel.findOneAndUpdate(filter, update, function(err, doc) {
        if (doc) {
            res.send(true);
        } else if (err) {
            res.send(false);
        }
    });
});

// get cart count
router.get('/getCartCount/:userid', (req, res) => {
    CartModel.collection.countDocuments({
        userid: parseInt(req.params.userid),
        is_deleted: 'N'
    }, function(err, total) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                total: total
            });
        }
    });

});

// get precheckout info
router.get('/getPreCheckoutInfo/:userid', (req, res) => {
    const userid = parseInt(req.params.userid);
    CartModel.aggregate([{
            $match: {
                userid: userid,
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, precheckoutInfo) {
        if (err) {
            console.log(err);
        } else {
            res.json(precheckoutInfo);
        }
    });
});

// get user claim information for precheckout page
router.post('/claim', jwtService.checkUser(), (req, res) => {
    orderController.getClaimInformation(req.body.shop_id, req.body.userid).then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.status(400).json({
            status: 'error',
            payload: err
        });
    });
});

// get user open (pending) oders information for open-order page
router.post('/userOpenOrders', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    OrderModel.aggregate([{
            $match: {
                userid: userid,
                status: 'pending',
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, openOrders) {
        if (err) {
            console.log(err);
        } else {
            res.json(openOrders);
        }
    });
});

// order status update and product availability update for open order page
router.post('/updateOrderToUnclaim', jwtService.checkUser(), (req, res) => {
    orderController.updateOrderStatusAndLcToBtc(req.body.userid, req.body.orderid, req.body.lctobtc, 'unclaim');
    orderController.updateAvailability(req.body.bz_pro_id, req.body.quantity);
    res.json({
        status: 'success',
        payload: 'order status and product availability update success'
    });
});

// cancel precheckout at open order page
router.post('/cancelPrecheckout', jwtService.checkUser(), (req, res) => {
    OrderModel.findOneAndUpdate({ orderid: req.body.orderid }, { status: 'cancel', update_time: Date.now() }).exec(async function(err, result) {
        if (err) {
            console.log('find precheckout record error ' + err);
            await res.json({
                status: 'error',
                payload: 'find precheckout record error'
            });
        } else {
            BalanceModel.findOneAndUpdate({ userid: req.body.userid }, { lc: req.body.lcamount, update_time: Date.now() }).exec(async function(err, result) {
                if (err) {
                    console.log('find user balance record error ' + err);
                    await res.json({
                        status: 'error',
                        payload: 'find user balance record error'
                    });
                } else {
                    console.log(result);
                    await res.json({
                        status: 'success',
                        payload: 'Added lc amount to user balance'
                    });
                }
            });
        }
    });
});

// get user (buyer) unclaim order information for unclaim order page
router.post('/buyerUnclaimOrders', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    OrderModel.aggregate([{
            $match: {
                userid: userid,
                status: 'unclaim',
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, unclaimOrders) {
        if (err) {
            console.log(err);
        } else {
            res.json(unclaimOrders);
        }
    });
});

// get seller unclaim order information for unclaim order page
router.post('/sellerUnclaimOrders', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    OrderModel.aggregate([{
            $match: {
                shop_id: userid,
                status: 'unclaim',
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, unclaimOrders) {
        if (err) {
            console.log(err);
        } else {
            res.json(unclaimOrders);
        }
    });
});

// get buyer's agent information for seller unclaim order page
router.post('/agentInfo', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.buyerid);
    UserModel.find({ userid: userid }, 'agent_id').exec(function(err, agent) {
        if (err) {
            console.log(err);
        } else {
            res.json(agent);
        }
    });
});

// order status update unlcaim -> claim
router.post('/updateOrderToClaim', jwtService.checkUser(), (req, res) => {
    orderController.updateOrderStatus(req.body.userid, req.body.orderid, 'claim');
    res.json({
        status: 'success',
        payload: 'Order Status updated'
    });
});

router.post('/setQBonus', jwtService.checkUser(), (req, res) => {
    const amount = parseFloat(req.body.amount);
    let reason = '';
    socketservice.sendAll("q_bonus", amount);
    res(true);
});

// increase lc balance of user
router.post('/increaseLcBalance', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    const amount = parseFloat(req.body.amount);
    let reason = '';
    BalanceModel.findOne({ userid }).then(record => {
        if (record) {
            const old_balance = record.lc;
            const new_balance = old_balance + amount;
            record.lc = new_balance;
            if (amount > 0)
                reason = "Your lc amount has increased by " + amount + ".";
            else if (amount < 0)
                reason = "Your lc amount has decreased by " + (-amount) + ".";
            else
                reason = '';
            console.log(reason);
            record.save().then(() => {
                socketservice.send(userid, "lc_balance", { amount: record.lc, reason });
                res.json({
                    status: 'success',
                    payload: 'increase amount success'
                })
            });
        } else {
            res.json({
                status: 'error',
                payload: 'increase amount error'
            });
        }
    });
});

// increase lc balance of agent
router.post('/increaseLcBalanceAgent', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    const amount = parseFloat(req.body.amount);
    let reason = '';
    let agent_id = 6;
    authController.checkUser(userid)
        .then(records => {
            if (!records) {
                /* Case: User not found  */
                res.json({
                    status: 'error',
                    payload: 'User not found.'
                });
            } else {
                /* Case: User exist  */
                if (records.agent_id > 0 && records.agent_id != userid) {
                    agent_id = records.agent_id;
                }
                authController.checkUser(agent_id).then(user => {
                    if (!user) {
                        // user(agent) not found
                        res.json({
                            status: 'error',
                            payload: 'Agent not found.'
                        });
                    } else {
                        // user()agent) exist
                        const userid = agent_id;
                        BalanceModel.findOne({ userid }).then(record => {
                            if (record) {
                                const old_balance = record.lc;
                                const new_balance = old_balance + amount;
                                record.lc = new_balance;
                                if (amount > 0)
                                    reason = "Your lc amount has increased by " + amount + ".";
                                else if (amount < 0)
                                    reason = "Your lc amount has decreased by " + (-amount) + ".";
                                else
                                    reason = '';
                                console.log(reason);
                                record.save().then(() => {
                                    socketservice.send(userid, "lc_balance", { amount: record.lc, reason });
                                    res.json({
                                        status: 'success',
                                        payload: 'increase amount success'
                                    })
                                });
                            } else {
                                res.json({
                                    status: 'error',
                                    payload: 'increase amount error'
                                });
                            }
                        });
                    }
                });
            }
        });
});

// get claimed orders for buyer at claim order page
router.post('/buyerClaimOrders', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    OrderModel.aggregate([{
            $match: {
                userid: userid,
                status: 'claim',
                is_deleted: 'N'
            }
        },
        {
            $sort: { update_time: -1 }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'shop_id',
                foreignField: 'userid',
                as: 'Baz_Info'
            }
        }
    ]).exec(function(err, claimOrders) {
        if (err) {
            console.log(err);
        } else {
            res.json(claimOrders);
        }
    });
});

// get sales Inventory for seller at sales inventory page
router.post('/getSalesInventory', jwtService.checkUser(), (req, res) => {
    const shop_id = parseInt(req.body.shop_id);
    OrderModel.aggregate([{
            $match: {
                shop_id: shop_id,
                status: 'claim',
                is_deleted: 'N',
                update_time: {
                    $gte: new Date(req.body.startDate),
                    $lte: new Date(req.body.endDate)
                }
            }
        },
        {
            $sort: { update_time: -1 }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, salesInventory) {
        if (err) {
            console.log(err);
        } else {
            res.json(salesInventory);
        }
    });
});

// get product data for edit
router.post('/productEdit', jwtService.checkUser(), (req, res) => {
    const bzp_id = parseInt(req.body.bzp_id);
    BzproductsModel.find({
        bz_pro_id: bzp_id
    }).exec(function(err, bzp) {
        if (err) {
            console.log('product get for edit error ' + err);
        } else {
            res.json(bzp);
        }
    });
});

// product edit and update bazaar product
router.post('/bzprodUpdate/:bzp_id', (req, res) => {
    const tmp = parseInt(req.params.bzp_id);
    const refill_flag = req.body.flag;
    var update_info = {
        bp_name: req.body.bp_name,
        bzp_photo: req.body.bzp_photo,
        bzp_type: req.body.bzp_type,
        product_description: req.body.product_description,
        update_time: Date.now()
    };
    if (refill_flag) {
        update_info['total_indirect_savings'] = req.body.total_indirect_savings;
        update_info['agent_savings'] = req.body.agent_savings;
        update_info['assigned_savings'] = req.body.assigned_savings;
        update_info['availability'] = req.body.availability;
        update_info['control_cc_price'] = req.body.control_cc_price;
        update_info['control_lc_price'] = req.body.control_lc_price;
        update_info['initial_cc_price'] = req.body.initial_cc_price;
        update_info['initial_lc_price'] = req.body.initial_lc_price;
        update_info['lc_btc'] = req.body.lc_btc;
        update_info['lc_cc'] = req.body.lc_cc;
        update_info['personal_savings'] = req.body.personal_savings;
        update_info['total_product_costs'] = req.body.total_product_costs;
    }
    BzproductsModel.findOneAndUpdate({
        bz_pro_id: tmp
    }, update_info).exec(function(err, rs) {
        if (rs) {
            res.json({
                status: 'success',
                payload: 'product update success'
            });
        } else {
            res.json({
                status: 'errer',
                payload: err
            });
        }
    });
});

// bazaar product delete
router.post('/deleteProduct', jwtService.checkUser(), (req, res) => {
    const bz_pro_id = parseInt(req.body.bz_pro_id);
    var update_info = {
        is_deleted: 'Y',
        update_time: Date.now()
    };
    BzproductsModel.findOneAndUpdate({
        bz_pro_id: bz_pro_id
    }, update_info).exec(function(err, rs) {
        if (rs) {
            res.json({
                status: 'success',
                payload: 'product delete success'
            });
        } else {
            res.json({
                status: 'errer',
                payload: err
            });
        }
    });
});

// get promo proucts for promo page
router.post('/getPromoProducts', jwtService.checkUser(), (req, res) => {
    BzproductsModel.aggregate([{
            $match: {
                user_country: req.body.user_country,
                bzp_type: 'promo',
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userid',
                foreignField: 'userid',
                as: 'Baz_Info'
            }
        }
    ]).exec(function(err, promoItems) {
        if (err) {
            console.log(err);
        } else {
            res.json(promoItems);
        }
    });
});

// get personal savings
router.post('/getPersonalSavings', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    OrderModel.aggregate([{
            $match: {
                shop_id: userid,
                status: 'claim',
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Bzp_Info'
            }
        }
    ]).exec(function(err, personalSavings) {
        if (err) {
            console.log(err);
        } else {
            res.json(personalSavings);
        }
    });
});

router.get('/getAvailable/:userid', (req, res) => {
    console.log("getAvailableID", req.params.userid)
    availableController.getAvailable(req.params.userid).then(result => {
        res.send({
            value: result
        });
    });
});

router.post('/setAvailable', (req, res) => {
    availableController.setAvailable(req.body.userid, req.body.flag).then(result => {
        res.send({
            value: result
        });
    });
});

router.post('/coinPayRequest', (req, res) => {
    console.log("reqID, Column: ", req.body.userid, req.body.column)
    
});

router.post('/setRequested', (req, res) => {
    console.log("reqID, Column: ", req.body.userid, req.body.column)
    availableController.setRequested(req.body.userid, req.body.column).then(result => {
        res.send({
            value: result
        });
    });
});

router.post('/setOrder', (req, res) => {
    console.log("setOrder: ", req.body)
    const record = new OrderModel({ 
        userid: req.body.userid, 
        lcamount: req.body.amount,
        type: 'bp',
        date: Date.now(),
        orderid: 0,
        status: 'successful'
    });
    record.save().then(result => {
        res.send({
            value: result
        });
    });
});

module.exports = router;
