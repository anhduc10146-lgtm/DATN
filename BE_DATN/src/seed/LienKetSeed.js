/******************************************************************** 
*                                                                   *
* Tạo ra database Users mẫu để thực hành trước vì chưa có database  *
*                                                                   *
* File này chạy riêng không liên quan gì đến file main.js           *
*                                                                   *
*********************************************************************/

const mongoose = require('mongoose');
const chalk = require('chalk');
const Thanh_vien = require('../models/Thanh_vien');
const Bo_truyen = require('../models/Bo_truyen');
const The_loai = require('../models/The_loai');
const bcrypt = require('bcrypt');
const functions = require('../services/functions');
const functions_tv = require('../services/Thanh_vien/functions');
// Tự connect tới database
mongoose.connect(process.env.BUILD_MODE === 'dev' ? process.env.MONGO_DB_CONNECT_DEV : process.env.MONGO_DB_CONNECT_PRODUCTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Tạo dữ liệu mới
exports.seed = async function (data) {
    try {
        const arr_ten_tv = [
            "Cù Thúy Hạnh",
            "Đàm Quỳnh Trang",
            "Lê Thị Lan Anh",
            "Nguyễn Linh Chi",
            "Nguyễn Thị Hồng Mây",
            "Phạm Hiệp Hoàng",
            "Phan Như Quỳnh",
            "Trương Trần Tố Uyên",
            "Vũ Cẩm Tú",
            "Vũ Đức Anh",

        ]

        const arr_ten_bo_truyen = [
            "Dragon Ball Rise",
            "Độc Thủ Vũ Y",
            "Dragon Ball Mutiverse",
            "Dragon Ball Super",
            "Jiren Vs Broly",
            "Onepunch Man",
            "Ta Là Hàn Tam Thiên",
            "Ta ở nhà 100 năm khi ra ngoài đã vô địch",
            "Tiên Tôn Lạc Vô Cực",
            "Tổ Sư Xuất Sơn",

        ]

        // Hàm chọn ngẫu nhiên các phần tử từ một mảng
        function getRandomElements(arr, count) {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }

        await Thanh_vien.find({ ten: { $in: arr_ten_tv } }).then(async (arrThanhVien) => {
            // Lấy danh sách _id bộ truyện và thể loại
            const arr_id_bo_truyen = await Bo_truyen.find({ ten: { $in: arr_ten_bo_truyen } }, { _id: 1 }).then(data => data.map(item => item._id));
            const arr_id_the_loai = await The_loai.find({ trangThai: 1 }, { id: 1, _id: 0 }).then(data => data.map(item => item.id));

            // Thực hiện cập nhật cho từng thành viên
            await Promise.all(
                arrThanhVien.map(async thanhVien => {
                    // Lấy 3 _id ngẫu nhiên từ danh sách bộ truyện
                    const randomBoTruyenIds = getRandomElements(arr_id_bo_truyen, 3);

                    // Lấy 3 id ngẫu nhiên từ danh sách thể loại
                    const randomTheLoaiIds = getRandomElements(arr_id_the_loai, 3);

                    // Xác định các _id mới cho truyenDaDoc
                    const newTruyenDaDoc = randomBoTruyenIds.filter(id => !thanhVien.truyenDaDoc.includes(id));
                    thanhVien.truyenDaDoc.push(...newTruyenDaDoc);

                    // Thêm số 1 vào tapDaDoc tương ứng với số lượng phần tử thêm vào truyenDaDoc
                    thanhVien.tapDaDoc.push(...Array(newTruyenDaDoc.length).fill(1));

                    // Xác định các id mới cho theLoaiYeuThich
                    const newTheLoaiYeuThich = randomTheLoaiIds.filter(id => !thanhVien.theLoaiYeuThich.includes(id));
                    thanhVien.theLoaiYeuThich.push(...newTheLoaiYeuThich);

                    // Xác định các _id mới cho truyenDaDoc
                    const newTruyenYeuThich = randomBoTruyenIds.filter(id => !thanhVien.truyenYeuThich.includes(id));
                    thanhVien.truyenYeuThich.push(...newTruyenYeuThich);

                    // Lưu lại thay đổi
                    await thanhVien.save();
                })
            );
        });

        console.log(chalk.green('Tạo các liên kết thành viên và bộ truyện, thể loại thành công'));
    }
    catch (err) {
        console.log('Lỗi Liên kết Seed: ', err, '\n Lỗi Liên kết Seed');
        return;
    }
}




