const {GenealogyOrder, GenealogyTree, BinarySeller, BalanceModel}  = require('../../../db/index')
class preOrderController {
    getPreOrder(req, res) {
        const userid = req.body.userid;
        const status = req.body.status;
        const column = req.body.column;
        const preOrders = [];
        GenealogyOrder.find({[column]: userid, status: status})
         .then(preOrder => {
             if(preOrder.length == 0) {
                 res.send(false);
             }
             console.log("preOrder: ", preOrder)
             for(let i=0; i<preOrder.length; i++) {
                 BinarySeller.findOne({_id: preOrder[i].product_id})
                     .populate('product')
                     .exec(function (err, products) {
                         products.product.push(preOrder[i]);
                         preOrders.push(products);
                         if ((i === preOrder.length - 1 )) {
                             res.status(200).json(preOrders);
                         }
                     });
             }
         })
    }

    deletePreOrder(req, res) {
        GenealogyOrder.findOneAndDelete({_id: req.query.order_id})
            .then(order => { res.status(200).json(order)});
    }

    releasePreOrder(req, res) {
        GenealogyOrder.findOneAndUpdate({_id: req.body.order_id}, {status: 'released'})
            .then(order => {res.status(200).send({status: 'success', order: order})})
    }

    updateTreeStatus(req, res) {
        const column = req.body.column;
        const value = req.body.value;
        console.log("UpdateTreStatus: ", column, value)
        GenealogyTree.findOneAndUpdate({user_id: req.body.consumer_id}, {[column]: value})
            .then(tree => {res.status(200).json(tree)})
    }

    removeTree(req, res) {
        const user_id = req.body.user_id;
        GenealogyTree.findOneAndDelete({user_id: user_id})
            .then(tree => {res.status(200).json(tree)})
    }

    updateLCBalance(req, res) {
        BalanceModel.find({userid: req.body.consumer_id}).then(
            balance=>{BalanceModel.update({userid: req.body.consumer_id}, {lc: balance[0]['lc'] + req.body.total_amount})
                .then(result => {res.status(200).json(result)})}
        )
    }

    placeOrder(req, res) {
        GenealogyOrder.find({consumer_id: req.body.consumer_id, seller_id: req.body.seller_id})
            .then(orders => {
                for (let i = 0; i< orders.length; i++) {
                    GenealogyOrder.findOneAndUpdate({_id: orders[i]['_id']}, {code: req.body.code})
                        .then(order => {if(i == orders.length - 1) {
                            res.status(200).send({status: true})
                        }})
                }
            })
    }
}
module.exports = new preOrderController();
