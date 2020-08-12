const {Encashment} = require('../../../db/index');
class encashmentController {
    create(req, res) {
        try {
            if(!req.body){
                res.send({
                    status: false,
                    message: 'Failed to insert data'
                });
            }
            else{
                const encashment = new Encashment({
                    user_id: req.body.user_id,
                    type: req.body.type,
                    amount: req.body.amount,
                    receivable_lc: req.body.receivable_lc,
                    total_lc: req.body.total_lc
                });
                encashment.save();
                res.send({
                    status: true,
                    message: 'Successfully created'
                })
            }
        } catch (e) {
            res.status(500).send(e);
        }
    };
    getEncashment(req, res) {
        console.log("reqParam", req.params.id)
        Encashment.find({user_id: req.params.id}).then(result => {
            res.json(result)
        });
    }
}

module.exports = new encashmentController();
