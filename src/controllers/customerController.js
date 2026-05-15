const Customer = require('../models/Customer');

// Hiện trang danh sách khách hàng
exports.getList = async (req, res) => {
    try {
                const user = req.session.user;

        const customers = await Customer.find().sort({ createdAt: -1 });
        res.render('admin/quanlikhachhang', { 
            title: 'Danh sách khách hàng', 
            layout:'layouts/admin',
            customers ,
            user: user
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

// 1. Hiện form sửa (lấy dữ liệu cũ đổ vào ô input)
exports.getEditForm = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id); // Tìm theo ID trên link
        res.render('customer/editkh', { title: 'Sửa Khách Hàng', customer });
    } catch (error) {
        res.status(500).send("Lỗi: " + error.message);
    }
};

// 2. Xử lý cập nhật vào DB
exports.postUpdate = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        await Customer.findByIdAndUpdate(req.params.id, { name, email, phone, address });
        res.redirect('/khachhang'); // Sửa xong quay về danh sách
    } catch (error) {
        res.status(500).send("Lỗi cập nhật: " + error.message);
    }
};
// Xử lý xóa khách hàng
exports.deleteCustomer = async (req, res) => {
    try {
        // Lấy ID từ đường dẫn và xóa trong DB
        await Customer.findByIdAndDelete(req.params.id);
        
        // Xóa xong thì quay về trang danh sách
        res.redirect('/khachhang');
    } catch (error) {
        res.status(500).send("Lỗi khi xóa: " + error.message);
    }
};