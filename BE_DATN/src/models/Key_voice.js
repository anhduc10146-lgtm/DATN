const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho hóa đơn
const keyVoiceSchema = new Schema({
    id: { // Id tự định nghĩa tăng dần 
        type: Number,
        require: true
    },
    key: { //Token chuyển đổi văn bản thành giọng nói 
        type: String,
        require: false
    },
    mail: { //Tài khoản tạo key
        type: String,
        require: false
    },
    trangThai: { //0. Đã hết hạn 1. Còn sử dụng được  
        type: Number,
        require: true
    },
    soLuongKyTuChoPhep: { // Số lượng ký tự cho phép
        type: Number,
        require: false
    },
    soLuongKyTuDaSuDung: { //Số lượng ký tự đã sử dụng
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
        collection: "KeyVoice"
    })
module.exports = mongoose.model('KeyVoice', keyVoiceSchema);