const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/Quan_tri_vien/QuanLyThanhVien');
const formData = require('express-form-data');
const { isAdmin } = require('../../middleware');

//Lấy danh sách thành viên
router.post('/danh_sach_thanh_vien', isAdmin, controllers.danhSachThanhVien);

//Cập nhật thông tin thành viên
router.post('/cap_nhat_thong_tin_thanh_vien', isAdmin, formData.parse(), controllers.capNhatThongTinThanhVien);

//Thay đổi trạng thái thành viên
router.post('/thay_doi_trang_thai', isAdmin, controllers.thayDoiTrangThaiThanhVien);

//Danh sách thông báo
router.post('/danh_sach_thong_bao', isAdmin, controllers.danhSachThongBao);

//Đánh dấu đã đọc
router.post('/doi_trang_thai_thong_bao', isAdmin, controllers.doiTrangThaiThongBao);

//Đổi trạng thái hóa đơn
router.post('/doi_trang_thai_hoa_don', isAdmin, controllers.doiTrangThaiHoaDon);

//Số lượng thông báo chưa đọc
router.get('/so_luong_thong_bao_chua_doc', isAdmin, controllers.soLuongThongBaoChuaDoc)

module.exports = router;
