
    function fillData(id, ten, hang, gia, dungtich) {
        document.getElementById('in-ten').value = ten;
        document.getElementById('in-hang').value = hang;
        // Chuyển giá về số để tránh lỗi input number nếu giá đang là 'Chưa có'
        document.getElementById('in-gia').value = isNaN(gia) ? 0 : gia;
        document.getElementById('in-dungtich').value = dungtich;
        
        // Cập nhật đường dẫn action
        document.getElementById('formEdit').action = '/xemay/edit/' + id;
    }
