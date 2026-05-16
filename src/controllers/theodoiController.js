// theodoiController.js
const gettrack = (req, res) => {
    res.render('theodoi/theodoi', { title: 'theo doi', layout: 'layouts/theodoi' });
};


const capNhatToaDo = (req, res) => {
    try {
        // GIẢI PHÁP: Nếu req.body có dữ liệu (Postman) thì dùng, không thì lấy từ req.query (App điện thoại)
        const inputData = Object.keys(req.body).length > 0 ? req.body : req.query;

        // Bóc tách dữ liệu từ biến trung gian inputData
        const { id, lat, lon, speed, bearing, batt } = inputData;

        // Chốt chặn: Nếu gói tin rác không có tọa độ thì bỏ qua luôn, không xử lý tiếp
        if (!lat || !lon) {
            return res.status(400).send("Dữ liệu không chứa tọa độ hợp lệ");
        }

        console.log(`[Controller] Nhận dữ liệu xe ${id}: ${lat}, ${lon}`);

        const io = req.app.get('io');

        if (io) {
            io.emit('xe-di-chuyen', {
                deviceId: id || "Xe-Chưa-Đặt-Tên",
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                speed: parseFloat(speed) || 0,
                bearing: parseFloat(bearing) || 0,
                battery: parseFloat(batt) || 100
            });
        }

        return res.status(200).send("Controller đã xử lý thành công!");

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