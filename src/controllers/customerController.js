const Customer = require('../models/Customer');

// Hiện trang danh sách khách hàng
exports.getList = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.render('customer/khachhang', { 
            title: 'Danh sách khách hàng', 
            cus: 'huy',
            customers 
        });
    } catch (error) {
        res.status(500).send("Lỗi lấy danh sách: " + error.message);
    }
};


// Hiện trang Form thêm mới
exports.getAddForm = (req, res) => {
    res.render('customer/addkh', { title: 'Thêm Khách Hàng', user: 'Toàn' });
};

// Xử lý lưu khách hàng vào DB
exports.postAdd = async (req, res) => {
    try {   
        const { name, email, phone, address } = req.body;
        const newCustomer = new Customer({ name, email, phone, address });
        await newCustomer.save();
        res.redirect('/khachhang');
    } catch (error) {
        res.status(500).send("Lỗi khi thêm: " + error.message);
    }
};  