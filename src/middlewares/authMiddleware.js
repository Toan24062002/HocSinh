module.exports = (req, res, next) => {
    // Kiểm tra xem trong session đã có thông tin user chưa
    if (req.session && req.session.user) {
        // Nếu đã đăng nhập, cho phép đi tiếp vào Controller
        return next();
    } else {
        // Nếu chưa đăng nhập, chuyển hướng về trang login kèm thông báo
        // Toàn có thể dùng flash message để hiện thông báo lỗi
        return res.redirect('/auth/dangnhap');
    }
};