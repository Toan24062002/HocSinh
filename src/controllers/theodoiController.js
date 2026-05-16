// theodoiController.js
const gettrack = (req, res) => {
    res.render('theodoi/theodoi', { title: 'theo doi', layout: 'layouts/theodoi' });
};


const capNhatToaDo = (req, res) => {
    try {
        const { id, lat, lon, speed, bearing, batt } = req.body;
        console.log(`[Controller] Nhận dữ liệu xe ${id}: ${lat}, ${lon}`);

        // Lấy biến io từ app
        const io = req.app.get('io');

        // BẮT BUỘC PHẢI THÊM CHỐT CHẶN NÀY ĐỂ CHẠY TRÊN VERCEL
        if (io) {
            io.emit('xe-di-chuyen', {
                deviceId: id || "Xe-Chưa-Đặt-Tên",
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                speed: parseFloat(speed) || 0,
                bearing: parseFloat(bearing) || 0,
                battery: parseFloat(batt) || 100
            });
        } else {
            // Khi chạy trên Vercel, dòng này sẽ in ra ở mục Logs của Vercel chứ không làm sập app
            console.log("[Vercel Mode] Đang không có kết nối Socket.io hoạt động.");
        }

        // Trả về 200 OK cho Postman
        return res.status(200).send("Controller đã xử lý thành công trên Vercel!");

    } catch (error) {
        console.error("Lỗi tại theodoiController:", error);
        return res.status(500).send("Có lỗi xảy ra tại Server");
    }
};

// Export controller để file khác có thể require và sử dụng
module.exports = {
    gettrack,
    capNhatToaDo
};