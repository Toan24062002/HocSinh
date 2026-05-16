const Account = require('../models/Account');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

// Cấu hình bộ gửi mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nptoan2002@gmail.com',
        pass: 'arpb izng yozv lsiq'
    }
});

exports.getLogin = (req, res) => {
    res.render('auth/dangnhap', { 
        layout: 'layouts/auth_layout',
        title: 'Đăng nhập' 
    });
};
exports.getRegister = (req, res) => {
    res.render('auth/dangky', { 
        layout: 'layouts/auth_layout', // Dùng layout đơn giản ở trên
        title: 'Đăng ký' 
    });
};

exports.postRegister = async (req, res) => {
    const { fullname, email, password } = req.body;
    
    // 1. Tạo OTP ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Lưu thông tin tạm vào session để chờ xác nhận
    req.session.tempUser = { fullname, email, password, otp };
    req.session.otpExpiry = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút

    // 3. Nội dung email
    const mailOptions = {
        from: 'Xe Máy Phát Huy <email-cua-toan@gmail.com>',
        to: email,
        subject: 'Mã xác thực đăng ký tài khoản',
        html: `<h3>Xin chào ${fullname},</h3>
               <p>Mã OTP của bạn là: <b style="font-size: 20px; color: red;">${otp}</b></p>
               <p>Mã này có hiệu lực trong 5 phút. Vui lòng không cung cấp mã này cho bất kỳ ai.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.render('auth/xacthuc_otp', { email: email, layout: 'layouts/auth_layout',
        title: 'Xác thực OTP'  });
    } catch (error) {
        console.log(error);
        res.send("Lỗi gửi mail rồi Toàn ơi!");
    }
};

exports.postVerifyOtp = async (req, res) => {
    const { userOtp } = req.body;
    
    // 1. Kiểm tra xem session có tồn tại tempUser không trước khi lấy thuộc tính
    if (!req.session || !req.session.tempUser) {
        return res.render('auth/xacthuc_otp', { 
            error: 'Phiên làm việc đã hết hạn hoặc không tồn tại!', 
            email: '', 
            layout: 'layouts/auth_layout', 
            title: 'Xác thực OTP' 
        });
    }

    const tempUser = req.session.tempUser;
    const otpExpiry = req.session.otpExpiry;

    // 2. Kiểm tra thời gian hết hạn
    if (Date.now() > otpExpiry) {
        delete req.session.tempUser; // Xóa dữ liệu cũ nếu đã hết hạn
        return res.render('auth/xacthuc_otp', { 
            error: 'Mã OTP đã hết hạn, Toàn hãy đăng ký lại nhé!', 
            email: tempUser.email, 
            layout: 'layouts/auth_layout', 
            title: 'Xác thực OTP' 
        });
    }

    // 3. So sánh mã OTP
    if (userOtp === tempUser.otp) {
        // OTP ĐÚNG -> Tiến hành băm mật khẩu và lưu vào DB
        const hashedPassword = await bcrypt.hash(tempUser.password, 10);
        const newUser = new Account({
            fullname: tempUser.fullname,
            email: tempUser.email,
            password: hashedPassword,
            role: 'staff' // Toàn có thể thêm mặc định role ở đây như đã bàn
        });
        
        await newUser.save();

        // 4. Xóa dữ liệu tạm để giải phóng session
        delete req.session.tempUser;
        delete req.session.otpExpiry;
        
        res.redirect('/auth/dangnhap');
    } else {
        res.render('auth/xacthuc_otp', { 
            error: 'Mã OTP không chính xác!', 
            email: tempUser.email, 
            layout: 'layouts/auth_layout', 
            title: 'Xác thực OTP' 
        });
    }
};
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm user theo email
        const user = await Account.findOne({ email });
        if (!user) {
            return res.render('auth/dangnhap', { error: 'Tài khoản không tồn tại!', layout: 'layouts/auth_layout' ,
        title: 'Đăng nhập',thongBao: {
            icon: 'error', // hiện dấu X màu đỏ
            title: 'Thông báo',
            text: 'Sai tài khoản hoặc mật khẩu.'
        }  });
        }

        // 2. So sánh mật khẩu bằng bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/dangnhap', { error: 'Sai mật khẩu!', layout: 'layouts/auth_layout' ,
        title: 'Đăng nhập',thongBao: {
            icon: 'error', // hiện dấu X màu đỏ
            title: 'Thông báo',
            text: 'Sai tài khoản hoặc mật khẩu.'
        }  });
        }

        // 3. Tạo Session (Lưu thông tin đăng nhập)
        req.session.user = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        };

        res.redirect('/admin'); // Vào trang quản trị
    } catch (err) {
        res.status(500).send("Lỗi đăng nhập: " + err.message);
    }
};

exports.getLogout = (req, res) => {
    // 1. Phá hủy session của người dùng
    req.session.destroy((err) => {
        if (err) {
            console.log("Lỗi khi đăng xuất:", err);
            return res.redirect('/admin'); // Nếu lỗi thì ở lại trang admin
        }
        
        // 2. Xóa cookie liên quan đến session trên trình duyệt (tùy chọn nhưng nên làm)
        res.clearCookie('connect.sid'); 
        
        // 3. Chuyển hướng về trang đăng nhập
        res.redirect('/auth/dangnhap');
    });
};
