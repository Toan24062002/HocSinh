const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
    tenanhslide: { type: String, required: true },
    linkanh: { type: String, required: true },
    stt: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Slide', SlideSchema);