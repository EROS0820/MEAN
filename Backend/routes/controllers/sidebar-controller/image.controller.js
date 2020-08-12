const path = require('path');
class imageController {
    read(req, res) {
        const image = req.params.image_name;
        res.sendFile(path.join(__dirname,'../../../upload/image/'+image));
    }
}
module.exports = new imageController();
