const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');



router.get('/', customerController.getList);
router.get('/addkh', customerController.getAddForm);
router.post('/addkh', customerController.postAdd);
router.get('/edit/:id', customerController.getEditForm);
router.post('/update/:id', customerController.postUpdate);
router.get('/delete/:id', customerController.deleteCustomer);
module.exports = router;  