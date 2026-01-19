const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho hóa đơn
const hoaDonSchema = new Schema({
    id: { // Id tự định nghĩa tăng dần 
        type: Number,
        require: true
    },
    tongSoTien: { // Tổng số tiền thanh toán
        type: Number,
        require: false
    },
    ngayTao: { // Ngày khách hàng tạo đơn
        type: Number,
        require: false
    },
    ngayDuyetDon: { // Ngày admin tiếp nhận và duyệt
        type: Number,
        require: false
    },
    minhChung: { // Minh chứng <url hình ảnh>
        type: String,
        require: false
    },
    hanhDong: {
        type: Number, // 0.Nạp tiền 1.Nâng cấp tài khoản lên vip 1 2.Gia hạn gói
        require: false
    },
    trangThai: {
        type: Number, // 0.Đã xóa 1.Đang xử lý 2.Lỗi 3.Thành công 4.Hủy
        require: false
    },
    maThanhVien: { // Id người thực hiện
        type: Schema.Types.ObjectId,
        require: false,
        ref: 'Thanhvien'
    }
},
    {
        collection: "Hoadon"
    })
module.exports = mongoose.model('Hoadon', hoaDonSchema);