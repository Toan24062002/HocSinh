const Slide = require('../models/Slide');

exports.getList = async (req,res)=>{
    try {
                const user = req.session.user;

        const dsslide = await Slide.find().sort({ createdAt: -1 });
                res.render('admin/quanlislide', { 
                    title: 'Slide ảnh trang chủ', 
                    layout:'layouts/admin',
                    dsslide ,
            user: user
                });
    } catch (error) {
                res.status(500).send("Lỗi lấy danh sách: " + error.message);

    }
}
exports.getAddForm = (req, res) => {
    res.render('slide/add', { title: 'Thêm ảnh', user: 'Toàn' });
};

// Xử lý lưu khách hàng vào DB
exports.postAdd = async (req, res) => {
    try {   
        const { tenanhslide, linkanh,stt } = req.body;
        const newSlide = new Slide({ tenanhslide, linkanh,stt });
        await newSlide.save();
        res.redirect('/admin/quanlislide');
    } catch (error) {
        res.status(500).send("Lỗi khi thêm: " + error.message);
    }
};  
