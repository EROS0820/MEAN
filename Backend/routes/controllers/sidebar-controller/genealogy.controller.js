const {UserModel} = require('../../../db/index');
const {GenealogyTree, GenealogyOrder, BalanceModel, BinarySeller, BalancePlus} = require('../../../db/index');
class genealogyController {
    getUsers(req, res) {
        try{
            UserModel.find({}).then(users => {
                res.status(200).json(users);
            });
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
    createOrder(req, res) {
        try {
            let products = [{}];
            products =  JSON.parse(req.body.products);
            for (let i = 0; i < products.length; i++) {
                const genealogyOrder = new GenealogyOrder ({
                    starter_id: products[i].starter_id,
                    consumer_id: products[i].consumer_id,
                    seller_id: products[i].seller_id,
                    product_id: products[i].product_id,
                    qty: products[i].qty
                });
                genealogyOrder.save();
            }
            res.send({status: true, msg: 'Successfully created'});
        }catch (e) {
            res.status(500).send(e);
        }
    }
    initTree(req, res) {
        try{
            if(req.body) {
                const tree = new GenealogyTree({
                    user_id: req.body.tree.id,
                    upper_id: 0,
                    position: 'origin',
                    seller_id: 0,
                    starter_id: 0,
                    status: 'pass'
                });
                tree.save().then(data=> {
                    res.send({status:'success',code: 201, data: data});
                });
            }
        }catch (e) {
            res.send(e);
        }
    }
    getUsersFromTree(req, res) {
        try{
            GenealogyTree.find({}).then(data => {res.send(data)})
        }catch (e) {
            res.send(e);
        }
    }
    getUsersFromTreeByStarter(req, res) {
        try{
            GenealogyTree.find({starter_id: req.query.starter_id}).then(data => {
                res.json(data);
            })
        }catch (e) {
            res.send(e);
        }
    }
    getUserByReferral(req, res) {
        console.log('reparamid', req.params.id)
        try{
            GenealogyTree.find({user_id: req.params.id}).then(data => {
                res.json(data[0].starter_id);
            })
        }catch (e) {
            res.send(e);
        }
    }
    createTree(req, res) {
        try{
            const genealogyTree = new GenealogyTree({
                user_id: req.body.data[0]['user_id'],
                upper_id: req.body.data[0]['upper_id'],
                absolute_position: req.body.data[0]['absolute_position'],
                position: req.body.data[0]['position'],
                seller_id: req.body.data[0]['seller_id'],
                starter_id: req.body.data[0]['starter_id'],
                status: req.body.data[0]['status']
            });
            genealogyTree.save().then(user_to_tree => {
                res.status(201).send(user_to_tree);
            });
        }catch (e) {
            res.status(500).send(e);
        }
    }
    updateLCBalance(req, res) {
        BalanceModel.findOneAndUpdate({ userid: req.body.userid }, {lc: req.body.lc}).then(result => {
            res.status(200).json(result);
        });
    }
    updateBTCBalance(req, res) {
        BalanceModel.findOneAndUpdate({ userid: req.body.userid }, {btc: req.body.btc}).then(result => {
            res.status(200).json(result);
        });
    }
    getPrevTotalIta(req, res) {
        const user_id = req.query.user_id;
        GenealogyTree.findOne({user_id: user_id})
            .then(tree => {res.status(200).json(tree)});
    }
    getTotalEarningBalance(req, res) {
        const user_id = req.query.user_id;
        GenealogyTree.findOne({user_id: user_id})
            .then(tree => {res.status(200).json(tree)});
    }
    updateTotalEarningBalance(req, res) {
        const user_id = req.body.user_id;
        const current_balance = req.body.current_balance;
        GenealogyTree.findOne({user_id: user_id})
            .then(tree => {
            GenealogyTree.findOneAndUpdate({user_id: user_id}, {total_earning: current_balance + tree['total_earning'], current_balance: current_balance + tree['current_balance']})
                .then(updateTree => { return res.status(200).json(updateTree)})});
    }
    updateCurrentBalance(req, res) {
        const user_id = req.body.user_id;
        const current_balance = req.body.current_balance;
        GenealogyTree.findOne({user_id: user_id})
            .then(tree => {
            GenealogyTree.findOneAndUpdate({user_id: user_id}, {current_balance: current_balance + tree['current_balance']})
                .then(updateTree => { return res.status(200).json(updateTree)})});
    }
    updateAvailability(req, res) {
        const product_id = req.body.product_id;
        const qty = req.body.qty;
        BinarySeller.findOneAndUpdate({_id: product_id}, {availability: qty})
            .then(product => {res.status(200).json(product)});
    }
    updateSellerLCBalance(req, res) {
        const userid = req.body.seller_id;
        const lc = req.body.lc;
        BalanceModel.findOne({userid: userid})
            .then(balance => {BalanceModel.findOneAndUpdate({userid: userid}, {lc: lc + balance['lc']})
                .then(result => {res.status(200).json(result)})});
    }
    updateBalancePlus(req, res) {
        console.log("updateBalancePlus ", req)
        const balancePlus = new BalancePlus({
            user_id: req.body.user_id,
            balance_plus: req.body.balancePlus,
            ita: req.body.ita,
            add_id: req.body.add_id,
            type: req.body.type
        });
        if (req.body.user_id == 0) {
            BalancePlus.find({}).remove().then(result => {res.status(200).json(result)})
        } else {
            balancePlus.save().then(data => {
                res.status(201).send(data);
            });
        }
    }
    getBalancePlus(req, res) {
        try{
            BalancePlus.find({}).then(data => {
                
                res.send(data);
            })
        }catch (e) {
            res.send(e);
        }
    }
    addProfit(req, res) {
        const user_id = req.body.user_id;
        const profit = req.body.profit;
        GenealogyTree.findOne({user_id: user_id})
            .then(tree => {
            GenealogyTree.findOneAndUpdate({user_id: user_id}, {profit: profit + tree['profit']})
                .then(updateTree => { return res.status(200).json(updateTree)})});
    }

    addReferralProfit(req, res) {
        const user_id = req.body.user_id;
        const profit = req.body.profit;
        GenealogyTree.findOne({user_id: user_id})
            .then(tree => {
            GenealogyTree.findOneAndUpdate({user_id: user_id}, {referral_profit: profit + tree['referral_profit']})
                .then(updateTree => { return res.status(200).json(updateTree)})});
    }

    positionExist(req, res) {
        const user_id = req.body.user_id;
        const position = req.body.position;
        GenealogyTree.findOne({upper_id: user_id, position: position})
        .then(tree => {
            return res.status(200).json(tree)
        });
    }
}

module.exports = new genealogyController();
