const express = require('express');
const router = express.Router();

// Import controller xử lý logic vào
const theodoiController = require('../controllers/theodoiController');

// Định nghĩa đường link: Khi ai đó POST tới link này, nó sẽ chạy hàm trong Controller
router.get('/tracking', theodoiController.gettrack);
router.post('/tracking', theodoiController.capNhatToaDo);

// Bạn có thể thêm các đường link khác liên quan đến theo dõi tại đây, ví dụ:
// router.get('/history', theodoiController.xemLaiLichTrinh);

// Export router ra ngoài
module.exports = router;