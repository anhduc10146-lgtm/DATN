const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho bộ truyện
const boTruyenSchema = new Schema({
    ten: { //Tên bộ truyện
        type: String,
        require: false
    },
    soTap: { //Số tập truyện hiện tại
        type: Number,
        require: false
    },
    trangThai: {
        type: Number, //1.Chờ duyệt 2.Phát hành 3.Đã gỡ
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
    ngayTao: { //Ngày tải lên
        type: Number,
        require: false
    },
    ngayDang: { //Ngày phát hành - Ngày duyệt
        type: Number,
        require: false
    },
    thoiGianCapNhat: { //Ngày cập nhật
        type: Number,
        require: false
    },
    gioiHanQuyenDoc: {
        type: Number, //0.Không 1.Có
        require: false
    },
    gioiHanLuaTuoi: { //Giới hạn lứa tuổi 0. Không giới hạn
        type: Number,
        require: false
    },
    soLuotTruyCap: { //Số lượt truy cập
        type: Number,
        require: false
    },
    giaBanQuyen: { //Giá bản quyền
        type: Number,
        require: false,
        default: 0
    },
    giaBan: { //Giá bán
        type: Number,
        require: false,
        default: 0
    },
    trangBia: { //Link url trang bìa
        type: String,
        require: false
    }
},
    {
        collection: "Botruyen"
    })
module.exports = mongoose.model('Botruyen', boTruyenSchema);