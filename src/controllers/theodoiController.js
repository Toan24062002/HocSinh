// theodoiController.js
const gettrack = (req, res) => {
    res.render('theodoi/theodoi', { title: 'theo doi', layout: 'layouts/theodoi' });
};


const capNhatToaDo = (req, res) => {
    try {
        // 1. Bóc tách dữ liệu từ Postman hoặc App Traccar Client gửi lên
        const { id, lat, lon, speed, bearing, batt } = req.body;

        console.log(`[Controller] Nhận dữ liệu xe ${id}: ${lat}, ${lon}`);

        // 2. Lấy biến Socket.io đã được cấu hình từ server.js
        const io = req.app.get('io');

        // 3. Bắn tín hiệu real-time xuống cho file map.html hiển thị chấm đỏ
        io.emit('xe-di-chuyen', {
            deviceId: id || "Xe-Chưa-Đặt-Tên",
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            speed: parseFloat(speed) || 0,
            bearing: parseFloat(bearing) || 0,
            battery: parseFloat(batt) || 100
        });

        // 4. [SAU NÀY] Bạn sẽ viết thêm logic lưu vào MongoDB tại đây:
        // await TrackingModel.create({ deviceId: id, location: ... })

        // 5. Phản hồi thành công về cho thiết bị/Postman
        return res.status(200).send("Controller đã xử lý và phát tín hiệu thành công!");

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