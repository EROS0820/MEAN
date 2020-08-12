const { UserModel, MetaModel } = require('../../db');
const shuffle = require('array-shuffle');
const filters = require('loopback-filters');
const mongoose = require('mongoose');

/**
 * Private Function
 * GetUsers : Return a list of users
 */
function getUsers() {
    return new Promise(resolve => {
        UserModel.find({})
            .then(records => resolve(records));
    });
}
class Dashboard {

    analytics() {
        return new Promise((resolve, reject) => {
            getUsers()
                .then(users => {
                    const total = users.length;
                    const wallets = [];
                    const userShortList = filters(shuffle(users), {
                        /* only retrieve  3 user */
                        limit: 3
                    });
                    userShortList.map(user => {
                        wallets.push({
                            id: user.userid,
                            wallet: user.wallet
                        });
                    });
                    resolve({ total, wallets });
                })
                .catch(err => reject(err));
        });
    }

    reset() {
        return new Promise((resolve, reject) => {
            mongoose.connection.db.dropDatabase(function(err, result) {
                const lcprice = new MetaModel({
                    key: 'lcprice',
                    value: '0.00000001'
                });
                lcprice.save();
                const default_wallet = new MetaModel({
                    key: 'default_wallet',
                    value: {
                        privateKey: 'cR6oJ3C98tgiNGbAM6ykJ9QjkPgtKzMYJXJV9aezctXGXi4DDGPp',
                        address: 'miHyowCgQxbVS3mdwFecTxEq9qk1R7EYPH'
                    }
                });
                default_wallet.save();
                const admin_login = new MetaModel({
                    key: 'admin_login',
                    value: {
                        email: 'admin@admin.com',
                        password: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
                    }
                });
                admin_login.save();
                resolve(true);
            });
        });
    }
}

module.exports = new Dashboard();