const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho thành viên
const thanhVienSchema = new Schema({
    ten: { // Tên thành viên
        type: String,
        require: false,
        default: ""
    },
    anhDaiDien: { // Ảnh đại diện
        type: String,
        require: false,
        default: ''
    },
    ngaySinh: { // Ngày dinh
        type: Number, // Dạng milisecond
        require: false
    },
    gioiTinh: { //Giới tính
        type: Number, // 0. Nữ 1.Nam 2.Khác
        require: false
    },
    diaChi: { // Địa chỉ
        type: String,
        require: false,
        default: ''
    },
    trangThai: {
        type: Number, // 0.Đã xóa 1.Chưa xóa
        require: false,
        default: 1
    },
    active: { // Trạng thái kích hoạt 0. Chưa kích hoạt, 1. Thành viên, 2. Thành viên vip
        type: Number,
        require: false,
        default: 0
    },
    otp: { // Mã otp
        type: String,
        require: true,
        default: ''
    },
    taiKhoan: { // Tài khoản
        type: String,
        require: false,
        default: ""
    },
    matKhau: { // Mật khẩu đã mã hóa
        type: String,
        require: false,
        default: ""
    },
    token: { // Token
        type: String,
        require: false,
        default: ""
    },
    refresh_token: { // Refesh_token
        type: String,
        require: false,
        default: ""
    },
    soDienThoai: { // Số điện thoại
        type: String,
        require: false,
        default: ""
    },
    email: { //Email
        type: String,
        require: false,
        default: ""
    },
    soDuTaiKhoan: { //Số dư tài khoản
        type: Number,
        require: false,
        default: 0
    },
    theLoaiYeuThich: [{ //Thể loại yêu thích
        type: Number,
        require: false
    }],
    truyenYeuThich: [{ //Truyện đã đọc
        type: Schema.Types.ObjectId,
        require: false,
        ref: "Botruyen"
    }],
    truyenDaDoc: [{ //Truyện đã đọc
        type: Schema.Types.ObjectId,
        require: false,
        ref: "Botruyen"
    }],
    tapDaDoc: [{ //Tập truyện đã đọc tương ứng với bộ truyện bên trên
        type: Number,
        require: false,
    }],
    ngayHetHanVip1: { // Ngày hết hạn vip 1
        type: Number,
        require: false
    },
    ngayTao: { // Ngày tạo
        type: Number,
        require: false
    },
    ngayCapNhat: { // Ngày cập nhật
        type: Number,
        require: false
    }
},
    {
        collection: "Thanhvien"
    })
module.exports = mongoose.model('Thanhvien', thanhVienSchema);