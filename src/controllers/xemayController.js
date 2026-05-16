const Xemay = require('../models/Xemay');

// Hiện trang danh sách khách hàng
exports.getList = async (req, res) => {
    try {
        // 1. Lấy số trang mà khách đang xem từ URL (Ví dụ: /xemay?page=2). Nếu không có thì mặc định là trang 1
        const page = parseInt(req.query.page) || 1; 
        const limit = 10; // Mỗi trang chỉ hiển thị đúng 10 chiếc xe
        
        // Tính số lượng xe cần bỏ qua (Ví dụ: Trang 2 thì bỏ qua 10 chiếc của trang 1)
        const skip = (page - 1) * limit; 

        // 2. Đếm tổng số xe đang có trong Database để tính xem có tổng cộng bao nhiêu trang
        const tongSoXe = await Xemay.countDocuments();
        const tongSoTrang = Math.ceil(tongSoXe / limit);

        // 3. Quét kho có chọn lọc: Vừa sắp xếp mới nhất, vừa nhảy cóc, vừa giới hạn số lượng
        const danhSachXe = await Xemay.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        // 4. Trả dữ liệu về cho file EJS render
        res.render('xemay/xemay-index', { 
            title: 'Danh Sách Xe Máy', 
            cus: 'huy',
            danhSachXe,
            currentPage: page,  // Trang hiện tại để file EJS biết mà tô đậm nút số trang
            tongSoTrang: tongSoTrang // Tổng số trang để file EJS vẽ ra các nút: [1], [2], [3]...
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

exports.getApiList = async (req, res) => {
    try {
        // Chữ "Xemay" này là tên Model mà Toàn đã require ở đầu file Controller nhé
        const danhSachXe = await Xemay.find(); 
        
        res.status(200).json({
            thongBao: "Thành công! Đây là dữ liệu thô từ Database",
            soLuongXe: danhSachXe.length,
            data: danhSachXe
        });
    } catch (error) {
        res.status(500).json({ loi: error.message });
    }
};