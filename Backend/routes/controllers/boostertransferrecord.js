const { BoostertransferrecordModel } = require('../../db/index')

class BoostertransferrecordController {
    saveTransferbooster(amount,LCValue,transaction_time) {
        const booster = new BoostertransferrecordModel({ 
            amount,LCValue, transaction_time
        });
        return booster.save().then(result => {
            return result;
        })
    }
    gettransferboosterdata(){
        return new Promise((resolve, reject) => {
            BoostertransferrecordModel.find({}).then(result => {
                resolve(result);
            });
        });
    }
    
}


module.exports = new BoostertransferrecordController()