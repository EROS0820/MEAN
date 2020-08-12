const { UserModel, MetaModel, BzproductsModel, CartModel,BalanceModel } = require('../../db/index');
const sha256 = require('crypto-js/sha256');
const { generateWallet } = require('../../services/bitcoin');
const jwtService = require('../middlewares/jwt');
const BalanceController = require('./balance');
const AvailableController = require('./available');

//Private Function
function findUserByEmail(email) {
    return UserModel.findOne({
        email
    });
}

class AuthController {
    emailExist(email) {
        return UserModel.find({email: email}).then(user => {
            return user;
        });
    }
    // Register User Func
    register(userData) {
        return new Promise((resolve, reject) => {
            // Check email is exist or not
            findUserByEmail(userData.email)
                .then(records => {
                    // Random a wallet address, a wallet key
                    const wallet = generateWallet();
                    if (!records) {
                        /* CASE: email not found  */
                        userData.userid = 0; /* Auto increase filed : userid */
                        userData.password = sha256(userData.password); /* Hash the password */
                        userData.wallet = wallet.address;
                        userData.privateKey = wallet.privateKey;
                        /* Save user to database */
                        const user = new UserModel(userData);
                        user.save()
                            .then(result => {
                                const user = {
                                    id: result.userid,
                                    email: result.email,
                                    wallet: result.wallet,
                                    phonenumber: result.phonenumber,
                                    user_country: result.user_country,
                                    currency_val: result.currency_val,
                                    bz_flag: result.bz_flag
                                };
                                BalanceController.create(result.userid);
                                AvailableController.create(result.userid);
                                user.token = jwtService.pack(user);
                                resolve(Object.assign({}, user));
                            })
                            .catch(err => reject(err));
                        /* ! Save user to database */
                    } else {
                        /* CASE: email  exist  */
                        reject('user already exist');
                    }
                });
        });
    }

    // Login Func
    login(userData) {
        return new Promise((resolve, reject) => {
            const {
                email,
                password
            } = userData;
            UserModel.findOne({
                    email,
                    password: sha256(password).toString()
                }).then(record => {
                    if (!record) {
                        /*CASE: user's information is incorrect */
                        reject('user not found');
                    } else {
                        /*CASE: user's information is correct */
                        const user = Object.assign({}, {
                            _id: record._id,
                            id: record.userid,
                            first_name: record.first_name,
                            last_name: record.last_name,
                            email: record.email,
                            wallet: record.wallet,
                            agent_id: record.agent_id,
                            user_country: record.user_country,
                            bz_flag: record.bz_flag,
                            bz_name: record.bz_name
                        });
                        // Create JWT Token
                        const token = jwtService.pack(user);
                        user.token = token;
                        resolve(user);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    adminlogin(userData) {
        const {
            email,
            password
        } = userData;
        return MetaModel.find({
            key: 'admin_login'
        }).then(records => {
            if (records && records.length > 0) {
                const email1 = records[0].value.email;
                const password1 = records[0].value.password;
                if (email1 == email && sha256(password).toString() == password1) {
                    return BalanceController.getDefaultWallet().then(defaultwallet => {
                        const user = {
                            id: 0,
                            email: email,
                            wallet: defaultwallet.address,
                        }
                        const token = jwtService.pack(user);
                        user.token = token;
                        return user;
                    });
                } else throw "Admin user info not correct.";
            } else {
                throw "Admin login info not found.";
            }
        });
    }

    getUsersCount() {
        return UserModel.find({}).countDocuments().then(count => {
            return count;
        });
    }

    getReferredCount(userid) {
        return new Promise((resolve, reject) => {
            UserModel.find({
                agent_id: userid
            }).countDocuments().then(count => {
                resolve(count);
            });
        });
    }

    LCBalance(userid){
        
        return new Promise((resolve, reject) => {
            BalanceModel.find({
                userid: userid
            }).then(result => {
                resolve(result);
            });
        });
    }

    EveryBalance(userid){
        
        return new Promise((resolve, reject) => {
            BalanceModel.find({}).then(result => {
                resolve(result);
            });
        });
    }

    getOtherid(req,userid){
        
        return new Promise((resolve, reject) => {
            BalanceModel.find({
                userid: req.text
            }).then(result => {
                resolve(result);
            });
        });
    }

    searchUsers(search) {
        if (/[0-9]+/.test(search)) {
            return UserModel.find({
                "userid": +search
            }).then(records => {
                return records;
            })
        }
        const re = new RegExp("^" + search + ".*", "i");
        return UserModel.find({
            $or: [{
                "first_name": re
            }, {
                "last_name": re
            }]
        }).then(records => {
            return records;
        });
    }

    bazaarCreate(id, userData) {
        return new Promise((resolve, reject) => {
            const userId = parseInt(id);
            UserModel.findOneAndUpdate({
                userid: userId
            }, {
                bz_name: userData.bz_name,
                city: userData.city,
                address: userData.address,
                shop_rule: userData.shop_rule,
                bz_flag: 1,
            }).exec(function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve('bazaar created');
                }
            });
        });
    }

    bazaarImage(id, filename) {
        return new Promise((resolve, reject) => {
            const userId = parseInt(id);
            UserModel.findOneAndUpdate({
                userid: userId
            }, {
                bz_photo: filename,
            }).exec(function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve('bazaar image saved');
                }
            });
        });
    }

    bzprodCreate(id, proData) {
        return new Promise((resolve, reject) => {
            proData.userid = parseInt(id);
            proData.bz_pro_id = 0;
            const bzproducts = new BzproductsModel(proData);
            bzproducts.save().then(res => {
                const pid = res.bz_pro_id;
                resolve(pid);
            }).catch(err => {
                reject(err);
            });
        });
    }

    addToCart(data) {
        return new Promise((resolve, reject) => {
            data.cart_id = 0;
            const cart = new CartModel(data);
            cart.save().then(res => {
                resolve('Product Successfully Added!');
            }).catch(err => {
                reject(err);
            });
        });
    }

    getBazaarInfo(userid) {
        return UserModel.findOne({ userid }).then(record => {
            if (record) {
                return record;
            }
            return 0;
        });
    }

    checkUser(userid) {
        return UserModel.findOne({
            userid
        });
    }
}
module.exports = new AuthController();
