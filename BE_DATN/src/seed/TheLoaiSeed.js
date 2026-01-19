/*********************************************************************** 
*                                                                      *
* Tạo ra database Thể loại mẫu để thực hành trước vì chưa có database  *
*                                                                      *
* File này chạy riêng không liên quan gì đến file main.js              *
*                                                                      *
************************************************************************/

const mongoose = require('mongoose');
const chalk = require('chalk');
const The_loai = require('../models/The_loai');
const functions = require('../services/functions');
// Tự connect tới database
mongoose.connect(process.env.BUILD_MODE === 'dev' ? process.env.MONGO_DB_CONNECT_DEV : process.env.MONGO_DB_CONNECT_PRODUCTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
exports.seed = async function (data) {
    try {
        const createdAt = functions.getTimeNow();
        // Xóa toàn bộ dữ liệu
        const arr_ten_tl = [
            "Action",
            "Adult",
            "Adventure",
            "Anime",
            "Chuyển Sinh",
            "Comedy",
            "Comic",
            "Cổ Đại",
            "Drama",
            "Fantasy",
            "Harem",
            "Live action",
            "Manhua",
            "Mecha",
            "One shot",
            "Ngôn Tình",
            "School Life",
            "Shounen",
            "Supernatural",
            "Trinh Thám",
            "Xuyên Không",
            "Ngoại truyện",
            "Horror",
            "Truyện màu",
            "Chính truyện",
            "Manhwa",
            "Các truyện khác"
        ]
        await The_loai.deleteMany({ ten: { $in: arr_ten_tl } })
            .then(data => {
                console.log(chalk.red("Đã xóa toàn bộ thể loại mẫu trong CSDL"));
            })
            .catch(err => {
                console.log(err);
            })

        //Tạo dữ liệu mới
        const data_the_loai = arr_ten_tl.map((item, index) => {
            return {
                ten: item,
                id: index + 1,
                parent_id: 0,
                ngayTao: createdAt,
                ngayCapNhat: createdAt,
                trangThai: 1
            }
        })

        const data_tl = await The_loai.create(...data_the_loai)
            .then(data => {
                console.log(chalk.green('Tạo thể loại mẫu thành công'));
                return data
            })
            .catch(err => console.log(err))
        return data_tl
    }
    catch (err) {
        console.log('Lỗi Thể loại Seed: ', err, '\n Lỗi Thể loại Seed');
        return;
    }

}



