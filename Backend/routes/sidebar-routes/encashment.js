const {Router} = require('express');
const encashmentController = require('../controllers/sidebar-controller/encashment.controller');
const router = Router();
router.post('/create', encashmentController.create);
router.get('/getEncashment/:id', encashmentController.getEncashment)
module.exports = router;