require('dotenv').config();
const app = require('./src/app');             // Lấy app đã cấu hình từ thư mục src
const connectDB = require('./src/config/db'); // Lấy hàm kết nối database

const PORT = process.env.PORT || 3000;

// 1. Kết nối Database
connectDB().then(() => {
    // 2. Sau khi kết nối DB thành công mới cho Server chạy
    app.listen(PORT, () => {
        console.log(`-----------------------------------------`);
        console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
        console.log(`-----------------------------------------`);
    });
}).catch(err => {
    console.error("Lỗi kết nối Database rồi Toàn ơi:", err);
});