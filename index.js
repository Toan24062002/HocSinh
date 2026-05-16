require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

// BỔ SUNG: Import thư viện HTTP và Socket.io
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

// 1. Tạo HTTP Server bọc lấy app Express
const server = http.createServer(app);

// 2. Khởi tạo Socket.io và cấu hình CORS
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// BƯỚC QUAN TRỌNG NHẤT: Gắn io vào app để theodoiController lấy ra dùng được
app.set('io', io);

// Lắng nghe sự kiện kết nối từ trình duyệt (map.html / theodoi.ejs)
io.on('connection', (socket) => {
    console.log(`✅ Đã có trình duyệt kết nối qua Socket.id: ${socket.id}`);
});

// Sửa lại đoạn này để Vercel chạy mượt hơn và kích hoạt Socket ở Local
const startServer = async () => {
    try {
        await connectDB(); // Đợi kết nối DB thành công
        
        // THAY ĐỔI: Chuyển từ app.listen thành server.listen để chạy cả Socket.io
        server.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Lỗi khởi động:", error);
    }
};

startServer();

// Dòng này cực kỳ quan trọng cho Vercel
module.exports = app;