const { OrderModel, BalanceModel, MetaModel, CartModel, BzproductsModel, GenealogyOrder, BinarySeller } = require('../../db/index')
const BalanceController = require('./balance');
const TranactionController = require('./transaction');
const AdderController = require('./adder');
const shortid = require('shortid');

class OrderController {
    add(req, userid) {
        return new Promise((resolve, reject) => {
            if (req.type == 'btol') {
                BalanceController.getBTCBalance(userid).then(btc_balance => {
                    if (btc_balance >= req.rate * req.amount_lc) {
                        BalanceController.increaseBtcAmount(userid, -req.rate * req.amount_lc, false);
                        AdderController.getMultiplier().then(result => {
                            const order = new OrderModel({
                                rate: req.rate,
                                lcamount: req.amount_lc,
                                userid: userid,
                                type: 'btol',
                                btc_paid: req.rate * req.amount_lc,
                                date: new Date(),
                                status: 'open',
                                orderid: 0,
                                paid : 'unpaid',
                                fee: req.amount_lc * result.CF
                            });
                            order.save().then((response) => {
                                console.log("@@@@@@@@@@@@@@@@@@",response);
                                this.getBTCPrice().then(btcprice => {
                                    if ((+req.rate).toFixed(15) >= (+req.rate).toFixed(15)) {
                                        this.doOrder(+btcprice);
                                        resolve(true);
                                    }else{
                                        resolve(true);
                                    }
                                });
                            });
                        });
                    } else {
                        reject("btcamount not enough");
                    }
                });
            } else if (req.type == 'ltob') {
                BalanceController.getLCBalance(userid).then(lc_balance => {
                    if (lc_balance >= +req.amount_lc) {
                        BalanceController.increaseLcAmount(userid, -req.amount_lc);
                        AdderController.getMultiplier().then(result => {
                            console.log(result);
                            const order = new OrderModel({
                                rate: req.rate,
                                lcamount: req.amount_lc,
                                userid: userid,
                                type: 'ltob',
                                btc_receive: (req.rate * req.amount_lc * (1 - result.CF)).toFixed(15) * 1,
                                date: new Date(),
                                status: 'open',
                                orderid: 0,
                                paid : 'unpaid',
                                fee: req.amount_lc * result.CF
                            });
                            order.save().then((response) => {
                                this.getLCPrice().then(lcprice => {
                                    if ((+lcprice).toFixed(15) >= (+req.rate).toFixed(15)) {
                                        this.doOrder(+lcprice);
                                        resolve(true);
                                    }else{
                                        resolve(true);
                                    }
                                });
                            });
                        });
                    } else {
                        reject("lcamount not enough");
                    }
                });
            } else if (req.type == 'bzppay') {
                BalanceController.getLCBalance(userid).then(lc_balance => {
                    if (lc_balance >= +req.total_payable_lc) {
                        BalanceController.increaseLcAmount(userid, -req.total_payable_lc);
                        AdderController.getMultiplier().then(result => {
                            console.log(result);
                            var claim = '';
                            if (!req.claim || req.cart_count == 1) {
                                claim = shortid.generate();
                            } else {
                                claim = req.claim;
                            }
                            const order = new OrderModel({
                                rate: req.rate,
                                lcamount: req.total_payable_lc,
                                userid: userid,
                                type: 'bzppay',
                                date: new Date(),
                                status: 'pending',
                                orderid: 0,
                                fee: req.total_payable_lc * result.CF,
                                shop_id: req.shop_id,
                                bz_pro_id: req.bz_pro_id,
                                quantity: req.quantity,
                                buy_controlled_cc_price: req.buy_controlled_cc_price,
                                total_payable_cc_price: req.total_payable_cc_price,
                                buy_controlled_lc_price: req.buy_controlled_lc_price,
                                tps: req.tps,
                                tas: req.tas,
                                claim: claim
                            });
                            const cart_id = parseInt(req.cart_id);
                            order.save().then(async() => {
                                // cart record is_deleted update
                                const filter = { cart_id: cart_id };
                                const update = { is_deleted: 'Y' };
                                await CartModel.findOneAndUpdate(filter, update);
                                this.getLCPrice().then(lcprice => {
                                    if ((+lcprice).toFixed(15) == (+req.rate).toFixed(15)) {
                                        this.doOrder(+lcprice);
                                        resolve(true);
                                    }
                                });
                            });
                        });
                    } else {
                        reject("lcamount not enough");
                    }
                });
            } else {
                BalanceController.getLCBalance(userid).then(lc_balance => {
                    if (lc_balance >= +req.amount_lc) {
                        BalanceController.increaseLcAmount(userid, -req.amount_lc);
                        AdderController.getMultiplier().then(result => {
                            // console.log(result);
                            const order = new OrderModel({
                                rate: (+req.rate).toFixed(15),
                                lcamount: req.amount_lc,
                                userid: userid,
                                type: 'bzpost',
                                date: new Date(),
                                status: 'successful',
                                orderid: 0,
                                fee: req.amount_lc * result.CF,
                                btc_paid: 1
                            });
                            order.save().then(() => {
                                this.getLCPrice().then(lcprice => {
                                    this.doOrder(+lcprice);
                                    resolve(true);
                                });
                            });
                        });
                    } else {
                        reject("lcamount not enough +++" + lc_balance + ":" + (+req.amount_lc));
                    }
                });
            }
        });
    }

    // cancel(req) {
    //     return OrderModel.find({ _id: req.orderid }).then(records => {
    //         if (records.length >= 1) {
    //             if (records[0].type == 'btol') {
    //                 return BalanceController.increaseBtcAmount(records[0].userid, records[0].lcamount * records[0].rate).then(result => {
    //                     records[0].status = 'cancel';
    //                     return records[0].save().then(() => {
    //                         return this.getOpenOrders(records[0].userid);
    //                     });
    //                 }).catch(err => {
    //                     console.log(err);
    //                 });
    //             }
    //             if (records[0].type == 'ltob') {
    //                 return BalanceController.increaseLcAmount(records[0].userid, records[0].lcamount).then(result => {
    //                     records[0].status = 'cancel';
    //                     return records[0].save().then(() => {
    //                         return this.getOpenOrders(records[0].userid);
    //                     })
    //                 }).catch(err => {
    //                     console.log(err);
    //                 });
    //             }
    //         } else {
    //             throw "The id not exists";
    //         }
    //     });
    // }
    /////////////////////////

    cancel(req) {
        return OrderModel.find({ lcamount: req.lcamount, userid: req.userid, orderid: req.orderid}).then(records => {
            if (records.length >= 0) {
                if (records[0].type == 'btol') {
                    return BalanceController.increaseBtcAmount(records[0].userid, records[0].lcamount * records[0].rate).then(result => {
                        records[0].status = 'cancel';
                        return records[0].save().then(() => {
                            return this.getOpenOrders(records[0].userid);
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
                if (records[0].type == 'ltob') {
                    return BalanceController.increaseLcAmount(records[0].userid, records[0].lcamount).then(result => {
                        records[0].status = 'cancel';
                        return records[0].save().then(() => {
                            return this.getOpenOrders(records[0].userid);
                        })
                    }).catch(err => {
                        console.log(err);
                    });
                }
            } else {
                throw "The id not exists";
            }
            /*
        }).catch(err => {
            console.log(err);*/
        });
     }

    getLCPrice() {
        return MetaModel.find({ key: 'lcprice' }).then(records => {
            if (records.length == 0) {
                const lcrecord = new MetaModel({ key: 'lcprice', value: '0.00000001' });
                lcrecord.save();
                return 0.00000001;
            } else {
                return records[0].value;
            }
        });
    }

    
    getBTCPrice() {
        return MetaModel.find({ key: 'lcprice' }).then(records => {
            if (records.length == 0) {
                const lcrecord = new MetaModel({ key: 'lcprice', value: '0.00000001' });
                lcrecord.save();
                return 0.00000001;
            } else {
                return records[0].value;
            }
        });
    }
    
    ///////////////////////////////////////
    doOrder(lccost) {
        let i=0;
        let tempobj;
        console.log("&&&&&&&&&&&&hit&&&&&&&&&&", lccost);
        OrderModel.find({
            "status": "open",
            $or: [
                { $and: [{ "type": "ltob" }, { "rate": { $lte: lccost } }] },
                { $and: [{ "type": "btol" }, { "rate": { $gte: lccost } }] }
            ]
        }).then(record => {
            console.log("WWWWWWWWWWWW",record);
            console.log("WWWWWWWWWWWWlength",record.length);
            while(i<record.length){
                if (record[i]) {
                    tempobj= record[i];
                    console.log("#################$$$$$$$$$$$$$$$$$$$$$$$$$$",tempobj)
                    console.log("#################$$$$$$$$$$$$$$$$$$$$$$$$$$",tempobj.userid)
                    AdderController.getMultiplier().then(result => {
                        console.log("#################$$$$$$$$$$$$$$$$$$$$$$$$$$ in",tempobj)
                        const userid = tempobj.userid;
                        const lcamount = tempobj.lcamount;
                        const type = tempobj.type;
                        const fee = tempobj.fee;
                        tempobj.adder = lcamount * result.AS;
                        tempobj.status = 'successful';
                        tempobj.save();
                        if (type == 'btol') {
                            AdderController.increaseAdder(lcamount * result.AS).then(() => {
                                socketservice.sendAll("convert created", tempobj);
                                this.chnageLC();
                            });
                            BalanceController.increaseLcAmount(userid, lcamount - fee);
                        }
                        if (type == 'ltob') {
                            AdderController.increaseSubtracter(lcamount * result.AS).then(() => {
                                socketservice.sendAll("convert created", tempobj);
                                this.chnageLC();
                            });
                            BalanceController.increaseBtcAmount(userid, tempobj.btc_receive, false);
                        }
                    });
                }
                i++;
            }
        });
    }

    ///////////////////////////////////////

    chnageLC() {
        AdderController.getGap().then(gap => {
            const new_lccost = (gap + 1) * 1e-8;
            MetaModel.findOne({ key: 'lcprice' }).then(metarecord => {
                if (metarecord) {
                    metarecord.value = new_lccost;
                    metarecord.save().then(() => {
                        socketservice.sendAll("lc_btc changed", new_lccost);
                        this.doOrder(new_lccost);
                    });
                }
            });
        });
    }
    
    getOpenOrders(userid) {
        return OrderModel.find({ userid: userid, status: 'open' }).sort({ orderid: -1 }).then(records => {
            return records;
        });
    }

    getSuccessOrders(userid) {
        return OrderModel.find({ userid: userid, status: 'successful' }).sort({ orderid: -1 }).then(records => {
            console.log("record:::", records)
            return records;
        });
    }

    getSuccessfulProductsOrders(userid) {
        const preOrders = [];
        return GenealogyOrder.find({ seller_id: userid, status: 'released' }).then(records => {
            if(records.length == 0) {
                res.json(records);
            }
            for(let i=0; i<records.length; i++) {
                console.log("binarySellerId: ", records[i].product_id)
                BinarySeller.findOne({_id: records[i].product_id})
                    .populate('product')
                    .exec(function (err, products) {
                        console.log('33333333333333333', records[i])
                        // products.product.push();
                        records[i].forEach((item) => {
                            products.product.push({}, item)
                        })
                        preOrders.push(products);
                        if ((i === records.length - 1 )) {
                            console.log('444444444444444', preOrders)
                            return preOrders;
                        }
                    });
            }
        });
    }

    savePaid(req,user) {
        return OrderModel.findOneAndUpdate({_id: req._id},{paid:req.paid}).then(result=>{
            return result;
        }) 
    }

    getAllOrders() {
        return OrderModel.find({}).sort({ orderid: -1 }).then(records => {
            return records;
        });
    }

    getLastBtolConversions() {
        return OrderModel.find({ type: "btol", status: "successful" }).sort({ date: -1 }).limit(7).then(records => {
            return records;
        });
    }

    getLastLtobConversions() {
        return OrderModel.find({ type: "ltob", status: "successful" }).sort({ date: -1 }).limit(7).then(records => {
            return records;
        });
    }

    getConversionLimit(userid) {
        return OrderModel.find({ type: "ltob", status: "open", userid: userid }).then(records => {
            let sum = 0,
                i = 0;
            for (; i < records.length; i++) {
                sum += records[i].btc_receive;
            }
            return 0.0001 - sum;
        });
    }

    getStocks(userid) {
        return OrderModel.find({ status: "successful" }).then(records => {
            let sum = 0,
                i = 0;
            for (; i < records.length; i++) {
                if (records[i].type == 'ltob') sum -= records[i].btc_receive;
                if (records[i].type == 'btol') sum += records[i].btc_paid;
            }
            return sum;
        });
    }

    getDecimalEditing(userid) {
        return MetaModel.findOne({
            key: 'DecimalEditing'
        }).then(record => {
            if (!record) {
                record = new MetaModel({
                    key: 'DecimalEditing',
                    value: 0
                });
                record.save();
            }
            return record.value;
        });
    }

    getBtcConversionSubmitted(userid) {
        return OrderModel.find({ status: "successful", type: 'btol', userid: userid }).then(records => {
            let sum = 0,
                i = 0;
            for (; i < records.length; i++) {
                sum += records[i].btc_paid;
            }
            return sum;
        });
    }

    getClaimInformation(shop_id, userid) {
        return OrderModel.find({ shop_id: shop_id, userid: userid, is_deleted: 'N' }, null, { sort: { date: -1 } }).then(record => {
            return record;
        });
    }

    getQBonus() {
        return MetaModel.findOne({
            key: 'QBonus'
        }).then(record => {
            if (!record) {
                return 0;
            }

            return record.value;
        });
    }

    updateOrderStatus(userid, orderid, status) {
        const filter = {
            userid: userid,
            orderid: orderid
        };
        const update = {
            status: status,
            update_time: Date.now()
        };
        OrderModel.findOneAndUpdate(filter, update).exec(function(err, result) {
            if (err) {
                console.log('order status updating error ' + err);
                return false;
            } else {
                console.log(result);
                return true;
            }
        });
    }

    updateOrderStatusAndLcToBtc(userid, orderid, lctobtc, status) {
        const filter = {
            userid: userid,
            orderid: orderid
        };
        const update = {
            status: status,
            update_time: Date.now(),
            lctobtc: lctobtc
        };
        OrderModel.findOneAndUpdate(filter, update).exec(function(err, result) {
            if (err) {
                console.log('order status updating error ' + err);
                return false;
            } else {
                console.log(result);
                return true;
            }
        });
    }

    updateAvailability(bz_pro_id, quantity) {
        const filter = { bz_pro_id: bz_pro_id };
        const update = {
            availability: quantity,
            update_time: Date.now()
        };
        BzproductsModel.findOneAndUpdate(filter, update).exec(function(err, result) {
            if (err) {
                console.log('product availability updating error ' + err);
                return false;
            } else {
                console.log(result);
                return true;
            }
        });
    }

    setQBonus(b) {
        return MetaModel.findOne({
            key: 'QBonus'
        }).then(record => {
            if (!record) {
                record = new MetaModel({
                    key: 'QBonus',
                    value: b
                });
            }
            record.value = b;
            record.save();
        });
    }
}
module.exports = new OrderController()
