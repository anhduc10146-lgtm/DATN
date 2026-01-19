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
        const createdAt = functions.getTimeNow();
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

        // Xóa toàn bộ dữ liệu
        await Thanh_vien.deleteMany({ ten: { $in: arr_ten_tv } })
            .then(data => {
                console.log(chalk.red("Đã xóa toàn bộ thành viên mẫu trong CSDL"));
            })
            .catch(err => {
                console.log(err);
            })

        let nguyen_thi_hong_may_img = ""
        let dam_quynh_trang_img = ""
        let pham_hoang_hiep_img = ""
        let le_thi_lan_anh_img = ""
        let phan_nhu_quynh_img = ""
        let nguyen_linh_chi_img = ""
        let vu_duc_anh_img = ""
        let cu_thuy_hanh_img = ""
        let vu_cam_tu_img = ""
        let truong_tran_to_uyen_img = ""

        if (JSON.stringify(data) != '{}') {
            if (data.nguyen_thi_hong_may_img && data.nguyen_thi_hong_may_img.size > 0)
                nguyen_thi_hong_may_img = await functions_tv.uploadAvatarResize(data.nguyen_thi_hong_may_img, createdAt)

            if (data.dam_quynh_trang_img && data.dam_quynh_trang_img.size > 0)
                dam_quynh_trang_img = await functions_tv.uploadAvatarResize(data.dam_quynh_trang_img, createdAt)

            if (data.pham_hoang_hiep_img && data.pham_hoang_hiep_img.size > 0)
                pham_hoang_hiep_img = await functions_tv.uploadAvatarResize(data.pham_hoang_hiep_img, createdAt)

            if (data.le_thi_lan_anh_img && data.le_thi_lan_anh_img.size > 0)
                le_thi_lan_anh_img = await functions_tv.uploadAvatarResize(data.le_thi_lan_anh_img, createdAt)

            if (data.phan_nhu_quynh_img && data.phan_nhu_quynh_img.size > 0)
                phan_nhu_quynh_img = await functions_tv.uploadAvatarResize(data.phan_nhu_quynh_img, createdAt)

            if (data.nguyen_linh_chi_img && data.nguyen_linh_chi_img.size > 0)
                nguyen_linh_chi_img = await functions_tv.uploadAvatarResize(data.nguyen_linh_chi_img, createdAt)

            if (data.vu_duc_anh_img && data.vu_duc_anh_img.size > 0)
                vu_duc_anh_img = await functions_tv.uploadAvatarResize(data.vu_duc_anh_img, createdAt)

            if (data.cu_thuy_hanh_img && data.cu_thuy_hanh_img.size > 0)
                cu_thuy_hanh_img = await functions_tv.uploadAvatarResize(data.cu_thuy_hanh_img, createdAt)

            if (data.vu_cam_tu_img && data.vu_cam_tu_img.size > 0)
                vu_cam_tu_img = await functions_tv.uploadAvatarResize(data.vu_cam_tu_img, createdAt)

            if (data.truong_tran_to_uyen_img && data.truong_tran_to_uyen_img.size > 0)
                truong_tran_to_uyen_img = await functions_tv.uploadAvatarResize(data.truong_tran_to_uyen_img, createdAt)
        }
        //Tạo thành viên thử nghiệm
        let data_thanh_vien = await Thanh_vien.create(
            {
                ten: "Nguyễn Thị Hồng Mây",
                anhDaiDien: nguyen_thi_hong_may_img,
                ngaySinh: new Date('2000-01-01'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 0,
                trangThai: 1,
                active: 1,
                taiKhoan: 'maynth@gmail.com',
                matKhau: await bcrypt.hash("maynth@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: "maynth@gmail.com",
                soDienThoai: "0987564321",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                ten: "Đàm Quỳnh Trang",
                anhDaiDien: dam_quynh_trang_img,
                ngaySinh: new Date('2001-02-02'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 0,
                trangThai: 1,
                active: 1,
                otp: '123456',
                taiKhoan: 'trangdq@gmail.com',
                matKhau: await bcrypt.hash("trangdq@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: "trangdq@gmail.com'",
                soDienThoai: "0987564322",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                ten: "Phạm Hiệp Hoàng",
                anhDaiDien: pham_hoang_hiep_img,
                ngaySinh: new Date('2001-03-03'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 1,
                trangThai: 1,
                active: 1,
                otp: '123456',
                taiKhoan: 'hiepph@gmail.com',
                matKhau: await bcrypt.hash("hiepph@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: "hiepph@gmail.com",
                soDienThoai: "0987564323",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                ten: "Lê Thị Lan Anh",
                anhDaiDien: le_thi_lan_anh_img,
                ngaySinh: new Date('2001-04-04'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 0,
                trangThai: 1,
                active: 1,
                otp: '123456',
                taiKhoan: 'anhltl@gmail.com',
                matKhau: await bcrypt.hash("anhltl@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: "anhltl@gmail.com",
                soDienThoai: "0987564324",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                ten: "Phan Như Quỳnh",
                anhDaiDien: phan_nhu_quynh_img,
                ngaySinh: new Date('2001-05-05'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 0,
                trangThai: 1,
                active: 1,
                otp: '123456',
                taiKhoan: 'quynhpn@gmail.com',
                matKhau: await bcrypt.hash("quynhpn@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: "quynhpn@gmail.com",
                soDienThoai: "0987564325",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                ten: "Nguyễn Linh Chi",
                anhDaiDien: nguyen_linh_chi_img,
                ngaySinh: new Date('2001-06-06'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 0,
                trangThai: 1,
                active: 1,
                otp: '123456',
                taiKhoan: 'chinl@gmail.com',
                matKhau: await bcrypt.hash("chinl@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: "chinl@gmail.com",
                soDienThoai: "0987564326",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                ten: "Vũ Đức Anh",
                anhDaiDien: vu_duc_anh_img,
                ngaySinh: new Date('2001-07-27'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 1,
                trangThai: 1,
                active: 1,
                otp: '123456',
                taiKhoan: 'anhvd@gmail.com',
                matKhau: await bcrypt.hash("anhvd@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: "",
                email: "anhvd@gmail.com",
                soDienThoai: "0987564327",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                ten: "Cù Thúy Hạnh",
                anhDaiDien: cu_thuy_hanh_img,
                ngaySinh: new Date('2001-08-08'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 0,
                trangThai: 1,
                active: 0,
                otp: '123456',
                taiKhoan: 'hanhct@gmail.com',
                matKhau: await bcrypt.hash("hanhct@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: "hanhct@gmail.com",
                soDienThoai: "0987564328",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                ten: "Vũ Cẩm Tú",
                anhDaiDien: vu_cam_tu_img,
                ngaySinh: new Date('2001-09-09'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 0,
                trangThai: 1,
                active: 2,
                otp: '123456',
                taiKhoan: 'tuvc@gmail.com',
                matKhau: await bcrypt.hash("tuvc@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: 'tuvc@gmail.com',
                soDienThoai: "0987564329",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },
            {
                ten: "Trương Trần Tố Uyên",
                anhDaiDien: truong_tran_to_uyen_img,
                ngaySinh: new Date('2001-10-10'),
                diaChi: "Ngõ 1, Đại Kim, Hoàng Mai, Hà Nội",
                gioiTinh: 0,
                trangThai: 0,
                active: 1,
                otp: '123456',
                taiKhoan: 'uyenttt@gmail.com',
                matKhau: await bcrypt.hash("uyenttt@gmail.com", 10),
                token: "",
                refresh_token: "",
                email: "uyenttt@gmail.com",
                soDienThoai: "0987564330",
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: createdAt,
                ngayCapNhat: createdAt
            },)
            .then(data => {
                console.log(chalk.green('Tạo thành viên mẫu thành công'));
                return data
            })
            .catch(err => console.log(err))
        return data_thanh_vien
    }
    catch (err) {
        console.log('Lỗi Thành viên Seed: ', err, '\n Lỗi Thành viên Seed');
        return;
    }
}




