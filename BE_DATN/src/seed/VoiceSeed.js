/******************************************************************** 
*                                                                   *
*   *
*                                                                   *
* File này chạy riêng không liên quan gì đến file main.js           *
*                                                                   *
*********************************************************************/

const mongoose = require('mongoose');
const chalk = require('chalk');
const Bo_truyen = require('../models/Bo_truyen');
const Key_voice = require('../models/Key_voice');
const Voice = require('../models/Voice');
const functions = require('../services/functions');
const functions_bt = require('../services/Bo_truyen/functions');
const axios = require('axios');
require('dotenv').config();

// Tự connect tới database
mongoose.connect(process.env.BUILD_MODE === 'dev' ? process.env.MONGO_DB_CONNECT_DEV : process.env.MONGO_DB_CONNECT_PRODUCTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.seed = async function (data) {
    try {
        //Lấy thời gian tạo voice
        const now = functions.getTimeNow();
        const name_arr = [
            "Dragon Ball Rise",
            "Độc Thủ Vũ Y",
            "Dragon Ball Mutiverse",
            "Dragon Ball Super",
            "Jiren Vs Broly",
            "Onepunch Man",
            "Ta Là Hàn Tam Thiên",
            "Ta ở nhà 100 năm khi ra ngoài đã vô địch",
            "Tiên Tôn Lạc Vô Cực",
            "Tổ Sư Xuất Sơn"
        ]

        const data_bo_truyen = await Bo_truyen.find({ ten: { $in: name_arr } }, { _id: 1, tomTat: 1 })
            .then(data => {
                return data;
            }).catch(error => {
                console.error(error);
            });

        const key_voice_arr = await Key_voice.find({ id: { $lt: 6 } }, { id: 1, key: 1, _id: 0 });

        const data_voice = data_bo_truyen.map((item, index) => {
            return {
                id: index + 1,
                ten: 'Tóm tắt truyện',
                noiDung: item.tomTat,
                trangThai: 1,
                keyVoice: Math.floor(index / 2) + 1,
                ngayTao: now,
                ngayCapNhat: now,
                maBoTruyen: item._id,
            };
        });

        const url = 'https://api.fpt.ai/hmi/tts/v5';
        const speed = 1;
        const voice = 'banmai';

        //Tạo voice
        for (let i = 0; i < data_bo_truyen.length; i++) {
            const matching = key_voice_arr.find(item => item.id == data_voice[i].keyVoice);
            data_voice[i].voiceUrl = await axios.post(url, data_voice[i].noiDung, { headers: { 'api-key': matching.key, 'speed': speed, 'voice': voice } })
                .then(response => {
                    return response.data.async;
                })
                .catch(error => {
                    console.error(error);
                    return 0;
                });
        };

        //Tạo dữ liệu mới
        const new_voice = await Voice.create(...data_voice)
            .then(data => {
                console.log(chalk.green('Tạo voice mẫu thành công'));
                return data
            })
            .catch(err => console.log(err))
        return new_voice;
    }
    catch (err) {
        console.log('Lỗi voice Seed: ', err, '\n Lỗi voice Seed');
        return;
    }
}



