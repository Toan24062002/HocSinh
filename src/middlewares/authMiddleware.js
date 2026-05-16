const checkLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // Hợp lệ, cho đi tiếp
    } else {
        return res.redirect('/auth/dangnhap');
    }
};

const isAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        return next(); 
    } 
    
    return res.render('admin/tongquan', { 
        title: 'Trang Chủ',
        user: 'Nguyễn Toàn',
        layout:'layouts/admin',
        thongBao: {
            icon: 'error', // hiện dấu X màu đỏ
            title: 'Từ chối truy cập!',
            text: 'Tài khoản của bạn không có quyền Admin.'
        }
    });
};

module.exports = {
    checkLogin,
    isAdmin
};