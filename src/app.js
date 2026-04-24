const express = require('express');
const path = require('path');
const app = express();

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

// 5. Sử dụng các Route
app.get('/', (req, res) => {
    // Thay vì dùng res.send, Fullstack sẽ dùng res.render để hiện file giao diện
    res.render('pages/index', { title: 'Trang Chủ',user: 'Nguyễn  Toàn' });
});

app.use('/khachhang', customerRoutes);
app.use('/themmoikhachhang', customerRoutes);

// Xuất app ra cho index.js
module.exports = app;