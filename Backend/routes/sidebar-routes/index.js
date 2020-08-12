const { Router } = require('express');
const binaryRoutes = require('./binary-seller');
const genealogyTree = require('./genealogy-tree');
const preOrderRoutes = require('./pre-order');
const encashment = require('./encashment')
const unilevel = require('./unilevel')
const router = Router();
router.get('/ping', (req,res) => res.send('pong'));
router.use('/binary-seller', binaryRoutes);
router.use('/genealogy-tree', genealogyTree);
router.use('/pre-order', preOrderRoutes);
router.use('/encashment', encashment);
router.use('/unilevel', unilevel);
module.exports = router;


