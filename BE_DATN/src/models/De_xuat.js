const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho đề xuất
const deXuatSchema = new Schema({
    ten: { //Tên bộ truyện
        type: String,
        require: false
    },
    trangThai: {
        type: Number, // 0.Chưa xem 1.Đã xem 2.Đã tải lên truyện
        require: false
    },
    tomTat: { // Tóm tắt
        type: String,
        require: false
    },
    tacGia: { //Tác giả
        type: String,
        require: false
    },
    theLoai: [{ //Thể loại
        type: Number,
        require: false
    }],
    link: { // Link truyện nếu có
        type: String,
        require: false
    },
    thoiGianDeXuat: { //Ngày cập nhật
        type: Number,
        require: false
    },
    trangBia: { //Link url trang bìa
        type: String,
        require: false
    },
    maThanhVien: { // Id người đề xuất
        type: Schema.Types.ObjectId,
        require: false,
        ref: 'Thanhvien'
    }
},
    {
        collection: "Dexuat"
    })
module.exports = mongoose.model('Dexuat', deXuatSchema);