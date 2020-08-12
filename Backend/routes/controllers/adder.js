const { MetaModel } = require('../../db/index')
const async = require('async');

class AdderController {

    increaseAdder(value) {
        return MetaModel.findOne({
            key: 'adder'
        }).then(record => {
            if (!record) {
                record = new MetaModel({
                    key: 'adder',
                    value: 0
                });
            }
            record.value = +record.value + value;
            return record.save().then(() => {
                return true;
            });
        });
    }

    increaseSubtracter(value) {
        return MetaModel.findOne({
            key: 'subtracter'
        }).then(record => {
            if (!record) {
                record = new MetaModel({
                    key: 'subtracter',
                    value: 0
                });
            }
            record.value = +record.value + value;
            return record.save().then(() => {
                return true;
            });
        });
    }

    getAdder() {
        return MetaModel.findOne({
            key: 'adder'
        }).then(adder => {
            if (adder) return adder.value;
            return 0;
        });
    }

    getSubtracter() {
        return MetaModel.findOne({
            key: 'subtracter'
        }).then(sub => {
            if (sub) return sub.value;
            return 0;
        });
    }

    getGap() {
        return MetaModel.findOne({
            key: 'adder'
        }).then(adder => {
            if (!adder) return 0;
            return MetaModel.findOne({
                key: 'subtracter'
            }).then(sub => {
                if (!sub) return adder.value;
                return adder.value - sub.value;
            });
        });
    }

    getMultiplier() {
        return new Promise((resolve, reject) => {
            async.parallel({
                    AS: (callback) => {
                        MetaModel.findOne({
                            key: 'ASmultiplier'
                        }).then(record => {
                            if (!record) {
                                record = new MetaModel({
                                    key: 'ASmultiplier',
                                    value: 0
                                });
                                record.save();
                            }
                            callback(null, record.value);
                        });
                    },
                    CF: (callback) => {
                        MetaModel.findOne({
                            key: 'CFmultiplier'
                        }).then(record => {
                            if (!record) {
                                record = new MetaModel({
                                    key: 'CFmultiplier',
                                    value: 0
                                });
                                record.save();
                            }
                            callback(null, record.value);
                        });
                    }
                },
                (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
        });
    }

    setMultiplier(req) {
        return new Promise((resolve, reject) => {
            const { AS, CF } = req;
            if (AS < 0 || AS >= 1) return reject("Must be between 0 to 1.");
            if (CF < 0 || CF >= 1) return reject("Must be between 0 to 1.");
            async.parallel([
                (callback) => {
                    MetaModel.update({
                        key: 'ASmultiplier'
                    }, {
                        $set: {
                            value: AS
                        }
                    }).then(() => {
                        callback(null, true);
                    });
                },
                (callback) => {
                    MetaModel.update({
                        key: 'CFmultiplier'
                    }, {
                        $set: {
                            value: CF
                        }
                    }).then(() => {
                        callback(null, true);
                    });
                }
            ], (err, results) => {
                if (err) reject(err);
                socketservice.sendAll("multiplier changed!", req);
                return resolve(results);
            });
        });
    }

    getBazaarValueSettings() {
        return new Promise((resolve, reject) => {
            async.parallel({
                    BtcConversionTarget: (callback) => {
                        MetaModel.findOne({
                            key: 'BtcConversionTarget'
                        }).then(record => {
                            if (!record) {
                                record = new MetaModel({
                                    key: 'BtcConversionTarget',
                                    value: 0
                                });
                                record.save();
                            }
                            callback(null, record.value);
                        });
                    },
                    RefillProductAvailavility: (callback) => {
                        MetaModel.findOne({
                            key: 'RefillProductAvailavility'
                        }).then(record => {
                            if (!record) {
                                record = new MetaModel({
                                    key: 'RefillProductAvailavility',
                                    value: 0
                                });
                                record.save();
                            }
                            callback(null, record.value);
                        });
                    },
                    LcMaintainingBalance: (callback) => {
                        MetaModel.findOne({
                            key: 'LcMaintainingBalance'
                        }).then(record => {
                            if (!record) {
                                record = new MetaModel({
                                    key: 'LcMaintainingBalance',
                                    value: 0
                                });
                                record.save();
                            }
                            callback(null, record.value);
                        });
                    },
                    TimeRunningLimit: (callback) => {
                        MetaModel.findOne({
                            key: 'TimeRunningLimit'
                        }).then(record => {
                            if (!record) {
                                record = new MetaModel({
                                    key: 'TimeRunningLimit',
                                    value: 6
                                });
                                record.save();
                            }
                            callback(null, record.value);
                        });
                    },
                    CycleBtcConversionTarget: (callback) => {
                        MetaModel.findOne({
                            key: 'CycleBtcConversionTarget'
                        }).then(record => {
                            if (!record) {
                                record = new MetaModel({
                                    key: 'CycleBtcConversionTarget',
                                    value: 0.5
                                });
                                record.save();
                            }
                            callback(null, record.value);
                        });
                    },
                    DecimalEditing: (callback) => {
                        MetaModel.findOne({
                            key: 'DecimalEditing'
                        }).then(record => {
                            if (!record) {
                                record = new MetaModel({
                                    key: 'DecimalEditing',
                                    value: 1
                                });
                                record.save();
                            }
                            callback(null, record.value);
                        });
                    }
                },
                (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
        });
    }

    setBazaarValueSettings(req) {
        return new Promise((resolve, reject) => {
            const { BtcConversionTarget, RefillProductAvailavility, LcMaintainingBalance, TimeRunningLimit, CycleBtcConversionTarget, DecimalEditing } = req;
            if (BtcConversionTarget <= 0) {
                return reject("BTC Conversion Target Value must be great than 0.");
            } else if (RefillProductAvailavility < 0) {
                return reject("Refill Product Value must be great than 0.");
            } else if (LcMaintainingBalance < 0) {
                return reject("LC Maintaining Balance Value must be great than 0.");
            } else if (TimeRunningLimit < 10) {
                return reject("Time Running Limit Valude must be great than 10 mins.");
            } else if (CycleBtcConversionTarget <= 0) {
                return reject("Cycle BTC Conversion Target Value must be great than 0");
            } else if(DecimalEditing <= 0){
                return reject("Decimal Editing must be greater than 0");
            }
            async.parallel([
                (callback) => {
                    MetaModel.update({
                        key: 'BtcConversionTarget'
                    }, {
                        $set: {
                            value: BtcConversionTarget
                        }
                    }).then(() => {
                        callback(null, true);
                    });
                },
                (callback) => {
                    MetaModel.update({
                        key: 'RefillProductAvailavility'
                    }, {
                        $set: {
                            value: RefillProductAvailavility
                        }
                    }).then(() => {
                        callback(null, true);
                    });
                },
                (callback) => {
                    MetaModel.update({
                        key: 'LcMaintainingBalance'
                    }, {
                        $set: {
                            value: LcMaintainingBalance
                        }
                    }).then(() => {
                        callback(null, true);
                    });
                },
                (callback) => {
                    MetaModel.update({
                        key: 'TimeRunningLimit'
                    }, {
                        $set: {
                            value: TimeRunningLimit
                        }
                    }).then(() => {
                        callback(null, true);
                    });
                },
                (callback) => {
                    MetaModel.update({
                        key: 'CycleBtcConversionTarget'
                    }, {
                        $set: {
                            value: CycleBtcConversionTarget
                        }
                    }).then(() => {
                        callback(null, true);
                    });
                },
                (callback) => {
                    MetaModel.update({
                        key: 'DecimalEditing'
                    }, {
                        $set: {
                            value: DecimalEditing
                        }
                    }).then(() => {
                        socketservice.sendAll("update_decimal_editing", DecimalEditing);
                        callback(null, true);
                    });
                }
            ], (err, results) => {
                if (err) reject(err);
                socketservice.sendAll("Bazaar Value Settings changed!", req);
                return resolve(results);
            });
        });
    }
}

module.exports = new AdderController();