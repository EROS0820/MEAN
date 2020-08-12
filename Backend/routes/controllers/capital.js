const { CapitalModel } = require('../../db/index')

class CapitalController {
    saveCapital(userid, amount, profit, days, total_fund, btc_price, btc_fund, maturity_time) {
        const record = new CapitalModel({ 
            userid, amount, profit, days, total_fund, btc_price, btc_fund, maturity_time
        });
        return record.save().then(result => {
            return result
        })
    }

    updatePending(_id, pending) {
        return CapitalModel.findOneAndUpdate({_id: _id}, {pending: pending}).then(records => {
            if (records && records.length >= 1) {
                return records;
            }
            return null;
        });
    }

    deleteCapital(_id) {
        return CapitalModel.findByIdAndDelete({_id: _id}).then(records => {
            if (records && records.length >= 1) {
                return records;
            }
            return null;
        });
    }

    getCapital() {
        return CapitalModel.find({}).then(records => {
            if (records && records.length >= 1) {
                return records;
            }
            return null;
        });
    }
}


module.exports = new CapitalController()