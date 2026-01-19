const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Tạo schema cho voice
const voiceSchema = new Schema({
    id: { // Id tự định nghĩa tăng dần 
        type: Number,
        require: true
    },
    ten: {// 
        type: String,
        require: true
    },
    noiDung: {
        type: String,
        require: true,
        default: ''
    },
    trangThai: { // 0. Valid link 1.Active link
        type: Number,
        require: true
    },
    keyVoice: { // Key voice
        type: Number,
        require: true
    },
    voiceUrl: { // Link text to speech
        type: String,
        require: true
    },
    ngayTao: { // Ngày tạo
        type: Number,
        require: true
    },
    ngayCapNhat: { // Ngày cập nhật
        type: Number,
        require: true
    },
    maBoTruyen: { // Mã bộ truyện
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Botruyen"
    },
    maTruyen: { // Mã truyện
        type: Schema.Types.ObjectId,
        require: false,
        ref: "Truyen"
    }

},
    {
        collection: "Voice"
    })
module.exports = mongoose.model('Voice', voiceSchema);