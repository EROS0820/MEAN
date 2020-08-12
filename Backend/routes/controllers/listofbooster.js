const { ListofboosterModel } = require('../../db/index');
const { func } = require('joi');

class ListofboosterController {
    saveBooster(userid,amount,transaction_time, pre_id) {
        const booster = new ListofboosterModel({ 
            userid, amount, transaction_time
        });
        return booster.save().then(result => {
           if(pre_id != 0)
               { ListofboosterModel.findOne({_id: pre_id}).then(data=>{
                var damount = data.amount+200;
                console.log("---------------------",damount)
                    ListofboosterModel.findOneAndUpdate({_id: pre_id},{amount:damount}).then(result=>{
                        return result;
                    }) 
                })}
                
            else{return result;}
                
            
        })
    }
    getboosterdata(userid){
        return new Promise((resolve, reject) => {
            ListofboosterModel.find({
            }).then(result => {
                resolve(result);
            });
        });
    }
    
}


module.exports = new ListofboosterController()


// updatePending(_id, pending) {
//     return CapitalModel.findOneAndUpdate({_id: _id}, {pending: pending}).then(records => {
//         if (records && records.length >= 1) {
//             return records;
//         }
//         return null;
//     });
// }

// deleteCapital(_id) {
//     return CapitalModel.findByIdAndDelete({_id: _id}).then(records => {
//         if (records && records.length >= 1) {
//             return records;
//         }
//         return null;
//     });
// }

// getCapital() {
//     return CapitalModel.find({}).then(records => {
//         if (records && records.length >= 1) {
//             return records;
//         }
//         return null;
//     });
// }