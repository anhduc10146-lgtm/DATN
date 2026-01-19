/******************************************************************** 
*                                                                   *
* Tạo ra database Admin mẫu để thực hành trước vì chưa có database  *
*                                                                   *
* File này chạy riêng không liên quan gì đến file main.js           *
*                                                                   *
*********************************************************************/

const mongoose = require('mongoose');
const chalk = require('chalk');
const Quan_tri_vien = require('../models/Quan_tri_vien');
const bcrypt = require('bcrypt');
const functions = require('../services/functions');
const functions_qtv = require('../services/Quan_tri_vien/functions')
// Tự connect tới database
mongoose.connect(process.env.BUILD_MODE === 'dev' ? process.env.MONGO_DB_CONNECT_DEV : process.env.MONGO_DB_CONNECT_PRODUCTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
exports.seed = async function (data) {
    try {
        const createdAt = functions.getTimeNow();
        // Xóa toàn bộ dữ liệu
        await Quan_tri_vien.deleteOne({ ten: "Phạm Việt Hoàng" })
            .then(data => {
                console.log(chalk.red("Đã xóa toàn bộ quản trị viên mẫu trong CSDL"));
            })
            .catch(err => {
                console.log(err);
            })
        let avatar_url = ""

        if (JSON.stringify(data) != '{}') {
            if (data.avatar_img && data.avatar_img.size > 0)
                avatar_url = await functions_qtv.uploadAvatarResize(data.avatar_img, createdAt)
        }
        //Tạo dữ liệu mới
        const data_qtv = await Quan_tri_vien.create(
            {
                ten: "Phạm Việt Hoàng",
                anhDaiDien: avatar_url,
                ngaySinh: functions._getTime("26/01/2001"),
                gioiTinh: 1,
                otp: '123456',
                active: 1,
                taiKhoan: "",
                matKhau: await bcrypt.hash("", 10),
                token: "",
                refresh_token: "",
                soDienThoai: "",
                email: "",
                quyen: "super_admin",
                adm_id: 1,
                ngayTao: createdAt,
                ngayCapNhat: createdAt,
                trangThai: 1
            })
            .then(data => {
                console.log(chalk.green('Tạo quản trị viên mẫu thành công'));
                return data;
            })
            .catch(err => console.log(err))
        return data_qtv;
    }
    catch (err) {
        console.log('Lỗi Quản trị viên Seed: ', err, '\n Lỗi Quản trị viên Seed');
        return;
    }
}



