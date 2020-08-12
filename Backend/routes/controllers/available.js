const { AvailableModel } = require('../../db/index')

class AvailableController {

    create(userid) {
        const record = new AvailableModel({ userid: userid, available_order: 1, available_withdrawal: 0 , requested_order: 0, requested_withdrawal: 0});
        record.save().then(res => {
        });
    }

    getAvailable(userid) {
        return AvailableModel.find({ userid: userid }).then(data => {
            return data;
        });
    }

    setAvailable(userid, flag) {
        console.log("userid, flag++++++++", userid, flag)
        if (flag) {
            return AvailableModel.findOneAndUpdate({userid: userid}, { available_order: 0, available_withdrawal: 1, update_time: Date.now() })
        } else {
            return AvailableModel.findOneAndUpdate({userid: userid}, { available_order: 1, available_withdrawal: 0, update_time: Date.now() })
        }
    }

    setRequested(userid, column) {
        return AvailableModel.findOne({userid: userid}).then(result => {
            console.log("result0: ", result)
            console.log("availableOrder: ", result.requested_order)
            console.log("result: ", result.userid)
            console.log("column: ", column, userid)
            if (column == 'requested_order') {
                return AvailableModel.findOneAndUpdate({userid: userid}, {requested_order: result.requested_order + 1})
            } else if (column == 'requested_withdrawal') {
                return AvailableModel.findOneAndUpdate({userid: userid}, {requested_withdrawal: result.requested_withdrawal + 1})
            }
        });
    }
        
}

module.exports = new AvailableController()