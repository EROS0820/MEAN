const {BinarySeller} = require('../../../db/index');
class binaryController {
    create(req, res) {
        try {
            if(!req.body){
                res.send({
                    status: false,
                    message: 'Failed to insert data'
                });
            }
            else{
                let image = req.files.image;
                let data = req.body;
                let path = './upload/image/';
                image.mv(path + image.name);
                const binarySeller = new BinarySeller({
                    userid: data.userid,
                    image:image.name,
                    product_name: data.product_name,
                    seller_price: data.seller_price,
                    availability: data.availability,
                    market_price: data.market_price
                });
                binarySeller.save();
                res.send({
                    status: true,
                    message: 'Successfully inserted'
                })
            }
        } catch (e) {
            res.status(500).send(e);
        }
    };

    read(req, res) {
        try{
            if(req.body.id) {
                BinarySeller.find({userid:req.body.id}).then(products=>{
                    res.status(200).json(products)
                });
            }
            else {
                BinarySeller.find({}).then(products=>{
                    res.status(200).json(products)
                });
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    }


    update(req, res) {
        try{
            BinarySeller.findOneAndUpdate({_id: req.body.data._id}, req.body.data).then(products=>{
                res.send({status:true, products:products});
            })
        }catch (e) {
            res.status(500).send(e);
        }
    }

    delete(req, res) {
        try{
            BinarySeller.findOneAndRemove({_id: req.body._id}).then(products=>{
                res.send({status: true, products: products})
            })
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
}

module.exports = new binaryController();
