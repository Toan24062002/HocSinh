const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['super_admin','admin', 'staff'], // Chỉ cho phép 2 giá trị này
        default: 'staff' // Mặc định là nhân viên
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', AccountSchema);