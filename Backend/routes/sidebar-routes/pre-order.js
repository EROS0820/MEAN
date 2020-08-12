const {Router} = require('express');
const preOrderController = require('../controllers/sidebar-controller/pre-order.controller');
const router = Router();
router.post('/getPreOrder', preOrderController.getPreOrder);
router.get('/deletePreOrder', preOrderController.deletePreOrder);
router.post('/releasePreOrder', preOrderController.releasePreOrder);
router.put('/updateTreeStatus', preOrderController.updateTreeStatus);
router.put('/updateLCBalance', preOrderController.updateLCBalance);
router.put('/placeOrder', preOrderController.placeOrder);
router.put('/removeTree', preOrderController.removeTree);
module.exports = router;
