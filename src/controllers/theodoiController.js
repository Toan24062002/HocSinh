// theodoiController.js
const gettrack = (req, res) => {
    res.render('theodoi/theodoi', { title: 'theo doi', layout: 'layouts/theodoi' });
};


const capNhatToaDo = (req, res) => {
    try {
        // 1. IN RA LOG ĐỂ KIỂM TRA CHÍNH XÁC APP ĐANG GỬI KIỂU GÌ (Xem trên Render Logs)
        console.log("[DEBUG APP] Body nhận được:", req.body);
        console.log("[DEBUG APP] Query nhận được:", req.query);

        // 2. GIẢI PHÁP BAO QUÁT: Gộp tất cả dữ liệu từ Query và Body vào làm một
        const inputData = { ...req.query, ...req.body };

        // 3. Bóc tách các thông số
        const { id, lat, lon, speed, bearing, batt } = inputData;

        // 4. Chốt chặn: Nếu gói tin trống không có tọa độ thì từ chối luôn
        if (!lat || !lon) {
            console.log(`⚠️ Bỏ qua gói tin trạng thái không có tọa độ từ xe: ${id || 'Ẩn danh'}`);
            return res.status(400).send("Dữ liệu không chứa tọa độ hợp lệ");
        }

        console.log(`[Controller] ✅ ĐÃ ĐỌC ĐƯỢC XE ${id}: ${lat}, ${lon}`);

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