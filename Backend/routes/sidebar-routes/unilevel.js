const {Router} = require('express');
const unilevelController = require('../controllers/sidebar-controller/unilevel.controller');
const router = Router();
router.post('/setProfit', unilevelController.setProfit);
router.get('/getUnilevel/:id', unilevelController.getUnilevel);
module.exports = router;