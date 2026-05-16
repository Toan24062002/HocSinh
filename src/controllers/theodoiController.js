// theodoiController.js
const gettrack = (req, res) => {
    res.render('theodoi/theodoi', { title: 'theo doi', layout: 'layouts/theodoi' });
};


const capNhatToaDo = (req, res) => {
    try {
        let id, lat, lon, speed, bearing, batt;

        // 1. KIỂM TRA: Nếu là cấu trúc lồng nhau từ App điện thoại iOS/Transistor
        if (req.body && req.body.location) {
            id = req.body.device_id || "Xe-App-Dien-Thoai";
            lat = req.body.location.coords.latitude;
            lon = req.body.location.coords.longitude;
            speed = req.body.location.coords.speed;
            bearing = req.body.location.coords.heading;
            // Pin của app gửi dạng 0.55 nên nhân với 100 thành 55%
            batt = req.body.location.battery ? (req.body.location.battery.level * 100) : 100;
        } 
        // 2. Ngược lại, nếu là cấu trúc phẳng từ Postman hoặc bản Android chuẩn
        else {
            const inputData = { ...req.query, ...req.body };
            id = inputData.id || "Xe-Postman";
            lat = inputData.lat;
            lon = inputData.lon;
            speed = inputData.speed;
            bearing = inputData.bearing;
            batt = inputData.batt;
        }

        // Chốt chặn: Không có tọa độ thì dừng
        if (!lat || !lon) {
            console.log(`⚠️ Bỏ qua gói tin không có tọa độ từ: ${id}`);
            return res.status(400).send("Dữ liệu không chứa tọa độ hợp lệ");
        }

        // Xử lý giá trị speed và bearing nếu bị âm (app trả về -1 khi đứng im)
        const validSpeed = parseFloat(speed) < 0 ? 0 : parseFloat(speed);
        const validBearing = parseFloat(bearing) < 0 ? 0 : parseFloat(bearing);

        console.log(`[Controller] ✅ ĐÃ ĐỌC ĐƯỢC XE ${id}: ${lat}, ${lon} | Tốc độ: ${validSpeed} km/h`);

        // Phát tín hiệu Real-time xuống cho Web bản đồ
        const io = req.app.get('io');
        if (io) {
            io.emit('xe-di-chuyen', {
                deviceId: id,
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                speed: validSpeed,
                bearing: validBearing,
                battery: parseFloat(batt) || 100
            });
        }

        // Trả về 200 để App điện thoại xóa hàng đợi (clear queue) trong bộ nhớ
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