const { ConvertModel } = require('../../db/index')

class ConvertController {
    saveBalance(userid, btcphp, lcphp, amountPHP, receivableBTC, previousBalance, presentBalance, btcPreviousBalance, btcCurrentBalance) {
        const record = new ConvertModel({ 
            userid, btcphp, lcphp, amountPHP, receivableBTC, previousBalance, presentBalance, btcPreviousBalance, btcCurrentBalance
        });
        return record.save().then(result => {
            return result
        })
    }

    getBalance(userid) {
        return ConvertModel.find({ userid }).then(records => {
            if (records && records.length >= 1) {
                return records;
            }
            return null;
        });
    }
}


module.exports = new ConvertController()