const { ReferralModel } = require('../../db/index')

class ReferralController {
    saveReferral(userid, type, ita, referraledId, amount) {
        let record
        let profit
        if (type != 'C') {
            profit = ita * 0.1875
        } else {
            profit = amount * 0.05
        }
        record = new ReferralModel({ 
            userid,
            type,
            ita,
            referraledId,
            profit: profit,
            amount
        });
        record.save()
    }

    getReferral(userid) {
        return ReferralModel.find({ userid }).then(records => {
            if (records && records.length >= 1) {
                return records;
            }
            return null;
        });
    }
}


module.exports = new ReferralController()