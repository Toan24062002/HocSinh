const express = require('express');
const router = express.Router();
const xemayController = require('../controllers/xemayController');

router.get('/xemay', xemayController.getList);
router.get('/', xemayController.getList);
router.get('/addxemay', xemayController.getAddForm);
router.post('/addxemay', xemayController.postAdd);
router.get('/delete/:id', xemayController.deleteXemay);

module.exports = router;