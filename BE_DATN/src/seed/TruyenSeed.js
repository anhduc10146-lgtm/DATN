/******************************************************************** 
*                                                                   *
* Tạo ra database Comics mẫu để thực hành trước vì chưa có database  *
*                                                                   *
* File này chạy riêng không liên quan gì đến file main.js           *
*                                                                   *
*********************************************************************/

const mongoose = require('mongoose')
const chalk = require('chalk')
const Truyen = require('../models/Truyen')
const Bo_truyen = require('../models/Bo_truyen')
const functions = require('../services/functions')

// Tự connect tới database
mongoose.connect(process.env.BUILD_MODE === 'dev' ? process.env.MONGO_DB_CONNECT_DEV : process.env.MONGO_DB_CONNECT_PRODUCTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.seed = async function () {
    try {
        const now = functions.getTimeNow();
        const name_arr_bt = [
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
        let id_bt_arr = []
        for (let i = 0; i < name_arr_bt.length; i++) {
            let name_bt = name_arr_bt[i];
            let id_bt = await Bo_truyen.find({ ten: name_bt }).then(data => data[0]._id);
            id_bt_arr.push(id_bt);
        }
        let index = 1;
        //Khởi tạo truyện seed
        const arr_t_create = [];
        for (let i = 0; i < name_arr_bt.length; i++) {
            let name_bt = name_arr_bt[i];
            let id_bt = await Bo_truyen.find({ ten: name_bt }).then(data => data[0]._id);
            if (id_bt != undefined && id_bt != null) {
                let name_bt_standardized = functions.standardized(name_bt);
                let bt_drive_id = await functions.getIdFolderDrive(name_bt_standardized);
                if (bt_drive_id != "") {
                    let list_chap = await functions.getListFileFromDrive_1(bt_drive_id, 'chap_1');
                    for (let j = 0; j < list_chap.length; j++) {
                        let chap_info = list_chap[j];
                        await functions.setFilePublicDrive(chap_info.id);
                        let tap = parseInt(chap_info.name.split('_')[1]);
                        let soTrang = await functions.getNumberOfFiles(chap_info.id);
                        arr_t_create.push(
                            {
                                id: index,
                                soTrang: soTrang,
                                tap: tap,
                                url: chap_info.id,
                                tomTat: "",
                                ngayDang: now,
                                ngayCapNhat: now,
                                soLuotTruyCap: 0,
                                trangThai: 2,
                                maBoTruyen: id_bt
                            }
                        )
                        index = index + 1;
                    }
                }
            }
        }
        const truyen = await Truyen.create(...arr_t_create)
            .then(data => {
                console.log(chalk.green('Tạo tập truyện mẫu thành công'));
                return data
            })
            .catch(err => console.log(err))
        return truyen;
    }
    catch (err) {
        console.log('Lỗi Truyện Seed: ', err, '\n Lỗi Truyện Seed');
        return;
    }
}




