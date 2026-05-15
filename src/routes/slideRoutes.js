const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');

router.post('/addslide', slideController.postAdd);

module.exports = router;