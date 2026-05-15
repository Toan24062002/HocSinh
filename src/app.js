require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const mongoose = require('mongoose');

// 1. Khai báo link kết nối kiểu truyền thống (vượt rào Vercel)
const myLink = process.env.MONGODB_URI;

// 2. Chốt chặn Mongoose: Chỉ dùng myLink
if (mongoose.connection.readyState === 0) {
    mongoose.connect(myLink, { // Đã sửa thành myLink
        serverSelectionTimeoutMS: 5000
    }).then(() => {
        console.log("✅ Vercel đã kết nối MongoDB thành công!");
    }).catch(err => {
        console.error("❌ Lỗi kết nối Mongoose trên Vercel:", err.message);
    });
}

// 3. Cấu hình Session: Cũng dùng myLink
app.use(session({
    secret: 'huy_future_secret_key',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: myLink, 
        dbName: 'HocSinhDB',
        collectionName: 'sessions',
    }),
    cookie: { 
        maxAge: 3600000,
        secure: false 
    }
}));

// 4. Cấu hình View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);

// 5. Cấu hình thư mục Public
app.use(express.static(path.join(__dirname, '../public')));

// 6. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 7. Import các Route
const customerRoutes = require('./routes/customerRoutes');
const xemayRoutes = require('./routes/xemayRoutes');
const adminRoutes = require('./routes/adminRoutes');
const slideRoutes = require('./routes/slideRoutes');
const authRoutes = require('./routes/authRoutes');

// 8. Sử dụng các Route
app.get('/', (req, res) => {
    res.render('pages/index', { title: 'Trang Chủ', user: 'Nguyễn Toàn' });
});
app.get('/lienhe', (req, res) => {
    res.render('pages/lienhe', { title: 'Trang liên hệ'});
});
app.get('/dichvu', (req, res) => {
    res.render('pages/dichvu', { title: 'Trang dịch vụ'});
});

app.use('/khachhang', customerRoutes);
app.use('/themmoikhachhang', customerRoutes);
app.use('/xemay', xemayRoutes);
app.use('/admin', adminRoutes);
app.use('/slide', slideRoutes);
app.use('/auth', authRoutes);

module.exports = app;