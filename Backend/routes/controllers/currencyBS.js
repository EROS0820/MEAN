const { CurrencyBSModel } = require('../../db/index');
const { func } = require('joi');

class CurrencyBSController {
    saveCurrency(currencyBS) {
        return CurrencyBSModel.findOneAndUpdate({_id: "5f201e9f8e69e898d2c9d5af"},{currencyBS:currencyBS}).then(result=>{
            return result;
        }) 
    }
    getCurrencydata(userid){
        return new Promise((resolve, reject) => {
            CurrencyBSModel.find({
            }).then(result => {
                resolve(result);
            });
        });
    }
    
}


module.exports = new CurrencyBSController()