const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const xemayController = require('../controllers/xemayController');
const customerController = require('../controllers/customerController');
const slideController = require('../controllers/slideController');

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/',authMiddleware, adminController.getTongquan);
router.get('/quanlixemay',authMiddleware, xemayController.getListAdmin);
router.get('/quanlikhachhang', authMiddleware,customerController.getList);
router.get('/quanlikhachhang', authMiddleware,customerController.getList);
router.get('/quanlislide',authMiddleware, slideController.getList);

module.exports = router;