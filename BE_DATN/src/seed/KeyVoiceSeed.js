/******************************************************************** 
*                                                                   *
*   *
*                                                                   *
* File này chạy riêng không liên quan gì đến file main.js           *
*                                                                   *
*********************************************************************/

const mongoose = require('mongoose');
const chalk = require('chalk');
const Key_voice = require('../models/Key_voice');
const functions = require('../services/functions');
require('dotenv').config();
// Tự connect tới database
mongoose.connect(process.env.BUILD_MODE === 'dev' ? process.env.MONGO_DB_CONNECT_DEV : process.env.MONGO_DB_CONNECT_PRODUCTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.seed = async function (data) {
    try {
        //Lấy thời gian tạo truyện
        const now = functions.getTimeNow();
        const createdAt = functions.getTimeNow();
        const key_voice_arr = ['', '', '', '', '']
        const mail = ['', '', '', '', '']

        // Xóa toàn bộ dữ liệu seed
        await Key_voice.deleteMany({ key: { $in: key_voice_arr } })
            .then(data => {
                console.log(chalk.red("Đã xóa toàn bộ key voice mẫu trong CSDL"));
            })
            .catch(err => {
                console.log(err);
            })

        //Tạo dữ liệu mới
        const key_voice = await Key_voice.create(
            {
                id: 1,
                key: key_voice_arr[0],
                mail: mail[0],
                trangThai: 1,
                soLuongKyTuChoPhep: 100000,
                soLuongKyTuDaSuDung: 0,
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                id: 2,
                key: key_voice_arr[1],
                mail: mail[1],
                trangThai: 1,
                soLuongKyTuChoPhep: 100000,
                soLuongKyTuDaSuDung: 0,
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                id: 3,
                key: key_voice_arr[2],
                mail: mail[2],
                trangThai: 1,
                soLuongKyTuChoPhep: 100000,
                soLuongKyTuDaSuDung: 0,
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                id: 4,
                key: key_voice_arr[3],
                mail: mail[3],
                trangThai: 1,
                soLuongKyTuChoPhep: 1500000,
                soLuongKyTuDaSuDung: 0,
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                id: 5,
                key: key_voice_arr[4],
                mail: mail[4],
                trangThai: 1,
                soLuongKyTuChoPhep: 100000,
                soLuongKyTuDaSuDung: 0,
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            }
        )
            .then(data => {
                console.log(chalk.green('Tạo key voice mẫu thành công'));
                return data
            })
            .catch(err => console.log(err))
        return key_voice;
    }
    catch (err) {
        console.log('Lỗi Key Voice Seed: ', err, '\n Lỗi Key Voice Seed');
        return;
    }
}



