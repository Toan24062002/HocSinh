const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/dangnhap', authController.getLogin);
router.get('/dangky', authController.getRegister);

router.post('/dangky', authController.postRegister);
router.post('/xacthuc_otp', authController.postVerifyOtp);
router.post('/dangnhap', authController.postLogin);
router.get('/logout', authController.getLogout);
module.exports = router;