const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho quản trị viên
const quanTriVienSchema = new Schema({
    ten: { // Tên quản trị viên
        type: String,
        require: false
    },
    anhDaiDien: { // Link ảnh đại diện
        type: String,
        require: false,
        default: ''
    },
    ngaySinh: { //Ngày sinh
        type: Number, // Dạng milisecond
        require: false
    },
    gioiTinh: {
        type: Number, // 0.Nữ 1.Nam 2.Khác
        require: false
    },
    otp: { // Mã otp
        type: String,
        require: true,
        default: ''
    },
    active: { // Kích hoạt
        type: Number,
        require: false,
        default: 0
    },
    trangThai: {
        type: Number, // 0.Đã xóa 1.Chưa xóa
        require: false
    },
    taiKhoan: { // Tài khoản
        type: String,
        require: false
    },
    matKhau: { // Mật khẩu đã mã hóa
        type: String,
        require: false
    },
    token: { // Token
        type: String,
        require: false
    },
    refresh_token: { // Refresh_token
        type: String,
        require: false
    },
    soDienThoai: { // Số điện thoại
        type: String,
        require: false
    },
    email: { // Email
        type: String,
        require: false
    },
    quyen: { // Quyền
        type: String,
        enum: ["super_admin", "admin"],
        require: false
    },
    adm_id: { // id admin
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
        collection: "Quantrivien"
    })
module.exports = mongoose.model('Quantrivien', quanTriVienSchema);