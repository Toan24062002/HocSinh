const mongoose = require('mongoose');

const XemaySchema = new mongoose.Schema({
    hangxe: { type: String, required: true },
    tenxe: { type: String, required: true },
    loaixe: { type: String, required: true },
    dungtichxilanh: String,
    gia: { type: Number, required: true },
    motaxemay: String,
    linkanh:String,
    mauxe:String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Xemay', XemaySchema);