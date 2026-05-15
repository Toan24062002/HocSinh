require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const session = require('express-session');

const MongoStore = require('connect-mongo').default;
// 1. Thêm mongoose vào đầu file app.js (nếu chưa có)
const mongoose = require('mongoose'); // Nhớ require thêm mongoose ở đầu app.js

app.use(session({
    secret: 'huy_future_secret_key',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        // Đảm bảo biến này đã được nạp ở dòng 1
        mongoUrl: process.env.MONGODB_URI, 
        dbName: 'HocSinhDB',
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native' 
    }),
    cookie: { 
        maxAge: 3600000,
        // Khi chạy trên Vercel (Production), nên để false nếu chưa cấu hình Trust Proxy
        secure: false 
    }
}));

// 1. Cấu hình View Engine (để đọc các file giao diện .ejs)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const expressLayouts = require('express-ejs-layouts');

// ... (sau các dòng app.set)
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Chỉ định file main.ejs là khung tổng
app.set('layout extractScripts', true); // Giúp Toàn viết script riêng cho từng trang nếu cần

// 2. Cấu hình thư mục Public (để chứa CSS, hình ảnh, Javascript cho giao diện)
app.use(express.static(path.join(__dirname, '../public')));

// 3. Middleware để đọc dữ liệu từ Form và JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Import các Route (đây là nơi bạn tách nhỏ trangchu.js, khachhang.js)
// Ví dụ: 
// const homeRoutes = require('./routes/homeRoutes');
 const customerRoutes = require('./routes/customerRoutes');
 const xemayRoutes = require('./routes/xemayRoutes');
 const adminRoutes = require('./routes/adminRoutes');
 const slideRoutes = require('./routes/slideRoutes');
 const authRoutes = require('./routes/authRoutes');


// 5. Sử dụng các Route
app.get('/', (req, res) => {
    // Thay vì dùng res.send, Fullstack sẽ dùng res.render để hiện file giao diện
    res.render('pages/index', { title: 'Trang Chủ',user: 'Nguyễn  Toàn' });
});
app.get('/lienhe', (req, res) => {
    // Thay vì dùng res.send, Fullstack sẽ dùng res.render để hiện file giao diện
    res.render('pages/lienhe', { title: 'Trang liên hệ'});
});
app.get('/dichvu', (req, res) => {
    // Thay vì dùng res.send, Fullstack sẽ dùng res.render để hiện file giao diện
    res.render('pages/dichvu', { title: 'Trang dịch vụ'});
});


app.use('/khachhang', customerRoutes);
app.use('/themmoikhachhang', customerRoutes);
app.use('/xemay', xemayRoutes);
app.use('/admin', adminRoutes);
app.use('/slide', slideRoutes);
app.use('/auth', authRoutes);

// Xuất app ra cho index.js


module.exports = app;
