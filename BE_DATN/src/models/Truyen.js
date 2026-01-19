const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho truyện
const truyenSchema = new Schema({
    id: {
        type: Number,
        require: false
    },
    soTrang: { // Số trang
        type: Number,
        require: false
    },
    tap: { // Tập số
        type: Number,
        require: false
    },
    url: { // Link folder chứa truyện
        type: String,
        require: false
    },
    tomTat: { // Tóm tắt truyện
        type: String,
        require: false
    },
    ngayDang: { // Ngày đăng
        type: Number,
        require: false
    },
    ngayCapNhat: { // Ngày cập nhật
        type: Number,
        require: false
    },
    soLuotTruyCap: { // Số lượt truy cập
        type: Number,
        require: false
    },
    trangThai: {
        type: Number, // 0. Đã xóa 1. Chờ duyệt 2. Hiển thị 3. Đã gỡ 4. Đang tải lên
        require: false
    },
    maBoTruyen: { // Mã bộ truyện
        type: Schema.Types.ObjectId,
        require: false,
        ref: "Botruyen"
    }
},
    {
        collection: "Truyen"
    })
module.exports = mongoose.model('Truyen', truyenSchema);