const { BoostersentrecordModel } = require('../../db/index')

class BoostersentrecordController {
    saveSentbooster(from,to,amount,transaction_time) {
        const booster = new BoostersentrecordModel({ 
            from, to, amount, transaction_time
        });
        return booster.save().then(result => {
            console.log("result",result)

            return result;
        })
    }
    getsentboosterdata(){
        return new Promise((resolve, reject) => {
            BoostersentrecordModel.find({}).then(result => {
                resolve(result);
            });
        });
    }
    
}


module.exports = new BoostersentrecordController()