const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho thông báo
const thongBaoSchema = new Schema({
    ten: { //Tên thông báo
        type: String,
        require: false
    },
    id: { // Id tự tăng
        type: Number,
        require: false
    },
    noiDung: { //Nội dung thông báo
        type: String,
        require: false
    },
    ngayTao: { // Ngày tạo
        type: Number,
        require: false
    },
    ngayXem: { // Ngày xem
        type: Number,
        require: false
    },
    trangThai: {
        type: Number, // 0.Chưa xem 1.Đã xem
        require: false
    },
    loai: { // Loai thông báo
        type: Number, // 0.Nạp tiền 1.Đề xuất mới 2.Nâng cấp tài khoản 3.Gia hạn gói
        require: false
    },
    maDeXuat: { //_id đề xuất tức _id truyện đề xuất
        type: Schema.Types.ObjectId,
        require: false,
        ref: "Dexuat"
    },
    maThanhVien: { // _id người thực hiện
        type: Schema.Types.ObjectId,
        require: false,
        ref: 'Thanhvien'
    },
    maHoaDon: { // _id hóa đơn
        type: Schema.Types.ObjectId,
        require: false,
        ref: 'Hoadon'
    }
},
    {
        collection: "Thongbao"
    })
module.exports = mongoose.model('Thongbao', thongBaoSchema);