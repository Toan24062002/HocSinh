exports.getTongquan = async (req, res) => {
    try {

        const user = req.session.user;
        res.render('admin/tongquan', { 
            title: 'Admin - Tổng quan', 
            layout:'layouts/admin.ejs',
            user: user
        });
    } catch (error) {
        res.status(500).send("Lỗi: " + error.message);
    }
};