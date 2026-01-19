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
const Truyen = require('../models/Truyen');
const Voice = require('../models/Voice');
require('dotenv').config();

// Tự connect tới database
mongoose.connect(process.env.BUILD_MODE === 'dev' ? process.env.MONGO_DB_CONNECT_DEV : process.env.MONGO_DB_CONNECT_PRODUCTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.seed = async function (data) {
    try {
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

        const id_bt_arr = await Bo_truyen.find({ ten: { $in: name_arr } }, { _id: 1 })
            .then(data => {
                return data.map(item => item._id);
            }).catch(error => {
                console.error(error);
            });

        //Xóa toàn bộ dữ liệu truyện
        await Truyen.deleteMany({ maBoTruyen: { $in: id_bt_arr } })
            .then(data => {
                console.log(chalk.red("Đã xóa toàn bộ truyện mẫu trong CSDL"));
            })

        //Xóa toàn bộ dữ liệu voice
        await Voice.deleteMany({ maBoTruyen: { $in: id_bt_arr } })
            .then(data => {
                console.log(chalk.red("Đã xóa toàn bộ voice mẫu trong CSDL"));
            })
            .catch(err => {
                console.log(err);
            })

        // Xóa toàn bộ dữ liệu bộ truyện
        await Bo_truyen.deleteMany({ ten: { $in: name_arr } })
            .then(data => {
                console.log(chalk.red("Đã xóa toàn bộ bộ truyện mẫu trong CSDL"));
            })
            .catch(err => {
                console.log(err);
            })
    }
    catch (err) {
        console.log('Lỗi khi xóa seed: ', err, '\n Lỗi khi xóa seed');
        return;
    }
}



