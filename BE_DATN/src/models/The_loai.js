const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho thể loại
const theLoaiSchema = new Schema({
    ten: { //Tên thể loại
        type: String,
        require: false
    },
    id: { // Id tự tăng
        type: Number,
        require: false
    },
    parent_id: { // Id cha
        type: Number,
        require: false
    },
    moTa: { //Mô tả để phục vụ cho tìm kiếm
        type: String,
        require: false
    },
    ngayTao: { // Ngày tạo
        type: Number,
        require: false
    },
    ngayCapNhat: { // Ngày cập nhật
        type: Number,
        require: false
    },
    trangThai: {
        type: Number, // 0.Đã xóa 1.Chưa xóa
        require: false
    },
},
    {
        collection: "Theloai"
    })
module.exports = mongoose.model('Theloai', theLoaiSchema);