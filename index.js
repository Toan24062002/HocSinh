require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Sửa lại đoạn này để Vercel chạy mượt hơn
const startServer = async () => {
    try {
        await connectDB(); // Đợi kết nối DB thành công
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Lỗi khởi động:", error);
    }
};

startServer();

// Dòng này cực kỳ quan trọng cho Vercel
module.exports = app;
