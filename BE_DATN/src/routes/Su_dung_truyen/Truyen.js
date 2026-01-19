const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/Su_dung_truyen/Truyen');
const { checkToken2 } = require('../../middleware');
const formData = require('express-form-data');

//Danh sách tất cả thể loại
router.post('/danh_sach_the_loai', formData.parse(), controllers.danhSachTheLoai);

//Danh sách tất cả bộ truyện
router.post('/danh_sach_bo_truyen', formData.parse(), controllers.danhSachBoTruyen);

//Tăng số lượt truy cập
router.post('/tang_so_luot_truy_cap', formData.parse(), controllers.tangSoLuotTruyCap);

//Chi tiết bộ truyện
router.post('/chi_tiet_bo_truyen', checkToken2, formData.parse(), controllers.chiTietBoTruyen);

//Đánh dấu yêu thích
router.post('/danh_dau_yeu_thich', checkToken2, formData.parse(), controllers.danhDauYeuThich);

//Kiểm tra vip
router.post('/check_vip', checkToken2, formData.parse(), controllers.checkVip);

//Danh sách trang truyện
router.post('/danh_sach_trang_truyen', checkToken2, formData.parse(), controllers.danhSachTrangTruyen);

//Danh sách tập truyện hiển thị
router.post('/danh_sach_tap_truyen_hien_thi', checkToken2, formData.parse(), controllers.danhSachTapTruyenHienThi);

//Danh sách truyện yêu thích
router.post('/danh_sach_truyen_yeu_thich', checkToken2, formData.parse(), controllers.danhSachTruyenYeuThich);

module.exports = router;