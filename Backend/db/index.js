const mongoose = require('mongoose');
const { DB_CONFIG } = require('../config/config');
const UserModel = require('./models/users');
const ListofboosterModel = require('./models/listofbooster');
const BoostersentrecordModel = require('./models/boostersentrecord');
const BoostertransferrecordModel = require('./models/boostertransferrecord');
const BalanceModel = require('./models/balance');
const OrderModel = require('./models/orders');
const MetaModel = require('./models/meta');
const CurrencyBSModel = require('./models/currencyBS');
const TransactionModel = require('./models/transaction');
const BzproductsModel = require('./models/bzproducts');
const CartModel = require('./models/cart');
const BarrowerModel = require('./models/crypto_cheque_barrower');
const BinarySeller = require('./models/sidebar-models/binary_seller');
const GenealogyOrder = require('./models/sidebar-models/genealogy_order');
const GenealogyTree = require('./models/sidebar-models/genealogy_tree');
const Encashment = require('./models/sidebar-models/encashment');
const Unilevel = require('./models/sidebar-models/unilevel');
const BalancePlus = require('./models/balance_plus');
const AvailableModel = require('./models/available');
const ConvertModel = require('./models/convert');
const ReferralModel = require('./models/referral');
const CapitalModel = require('./models/capital');


// Disable deprecated Warning
mongoose.set('useFindAndModify', false);
/**
 * Connect to database
 * Edit config in file config/database.json
 */
function connect() {
  //  return mongoose.connect(`mongodb://${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`);
    const connector = mongoose.connect(DB_CONFIG.host, { dbName: DB_CONFIG.database }).then(() => {
            console.log('Connection to the Atlas Cluster is successful!');
        })
        .catch((err) => console.error(err));
    return connector;
}
/**
 * Auto connect to database when app start
 * it will keep the session during the app running
 */
//connect().catch(err => { throw err });
 connect();
module.exports = {
    UserModel,
    ListofboosterModel,
    BalanceModel,
    BoostersentrecordModel,
    OrderModel,
    BoostertransferrecordModel,
    MetaModel,
    TransactionModel,
    BzproductsModel,
    CartModel,
    BarrowerModel,
    BinarySeller,
    GenealogyOrder,
    GenealogyTree,
    BalancePlus,
    CurrencyBSModel,
    AvailableModel,
    Encashment,
    Unilevel,
    ConvertModel,
    ReferralModel,
    CapitalModel
};
