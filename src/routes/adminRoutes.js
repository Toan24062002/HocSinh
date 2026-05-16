const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const xemayController = require('../controllers/xemayController');
const customerController = require('../controllers/customerController');
const slideController = require('../controllers/slideController');

const { checkLogin, isAdmin } = require('../middlewares/authMiddleware'); 
// Đổi lại đúng đường dẫn file của Toàn nhé
router.get('/',checkLogin, adminController.getTongquan);
router.get('/quanlixemay',checkLogin, xemayController.getListAdmin);
router.get('/quanlikhachhang', checkLogin,isAdmin,customerController.getList);
router.get('/quanlikhachhang', checkLogin,customerController.getList);
router.get('/quanlislide',checkLogin, slideController.getList);

module.exports = router;