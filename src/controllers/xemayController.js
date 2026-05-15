const Xemay = require('../models/Xemay');

// Hiện trang danh sách khách hàng
exports.getList = async (req, res) => {
    try {
        const danhSachXe = await Xemay.find().sort({ createdAt: -1 });
        res.render('xemay/xemay-index', { 
            title: 'Danh sách khách hàng', 
            cus: 'huy',
            danhSachXe 
        });
    } catch (error) {
        res.status(500).send("Lỗi lấy danh sách: " + error.message);
    }
};
exports.getListAdmin = async (req, res) => {
    try {
                const user = req.session.user;

        const danhSachXe = await Xemay.find().sort({ createdAt: -1 });
        res.render('admin/quanlixemay', { 
            title: 'Quản lý xe máy', 
            layout:'layouts/admin',
            danhSachXe ,
            user: user
        });
    } catch (error) {
        res.status(500).send("Lỗi lấy danh sách: " + error.message);
    }
};    

exports.getAddForm = (req, res) => {
    res.render('xemay/add-xemay', { title: 'Thêm xe', user: 'Toàn' });
};

exports.postAdd = async (req, res) => {
    try {   
        const { hangxe, tenxe, dungtichxilanh, loaixe,gia, motaxemay,linkanh,mauxe } = req.body;
        const newXemay = new Xemay({ hangxe, tenxe, dungtichxilanh, loaixe,gia, motaxemay,linkanh ,mauxe});
        await newXemay.save();
        res.redirect('/admin/quanlixemay');
    } catch (error) {
        res.status(500).send("Lỗi khi thêm: " + error.message);
    }
};  
exports.deleteXemay = async (req, res) => {
    try {
        // Lấy ID từ đường dẫn và xóa trong DB
        await Xemay.findByIdAndDelete(req.params.id);
        
        // Xóa xong thì quay về trang danh sách
        res.redirect('/admin/quanlixemay');
    } catch (error) {
        res.status(500).send("Lỗi khi xóa: " + error.message);
    }
};