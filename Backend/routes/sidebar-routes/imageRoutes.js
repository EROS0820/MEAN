const {Router} = require('express');
const ImageController = require('../controllers/sidebar-controller/image.controller');
const router = new Router();

router.get('/:image_name', ImageController.read);
module.exports = router;
