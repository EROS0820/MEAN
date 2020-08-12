const {Unilevel} = require('../../../db/index');
class unilevelController {
    setProfit(req, res) {
        try {
            if(!req.body){
                res.send({
                    status: false,
                    message: 'Failed to insert data'
                });
            }
            else{
                const unilevel = new Unilevel({
                    user_id: req.body.user_id,
                    ita: req.body.ita,
                    profit: req.body.ita * 0.0391,
                    name: req.body.name,
                    add_id: req.body.add_id,
                    type: req.body.type
                });
                unilevel.save();
                res.send({
                    status: true,
                    message: 'Successfully created'
                })
            }
        } catch (e) {
            res.status(500).send(e);
        }
    };
    getUnilevel(req, res) {
        Unilevel.find({user_id: req.params.id}).then(result => {
            res.json(result)
        });
    }
}

module.exports = new unilevelController();
