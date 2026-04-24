const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getList);
router.get('/addkh', customerController.getAddForm);
router.post('/addkh', customerController.postAdd);

module.exports = router;