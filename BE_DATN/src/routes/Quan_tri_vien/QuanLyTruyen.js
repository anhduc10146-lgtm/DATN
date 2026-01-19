const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/Quan_tri_vien/QuanLyTruyen');
const { isAdmin } = require('../../middleware');
const formData = require('express-form-data');

//phương thức tạo bộ truyện mới
router.post('/tao_truyen_moi', formData.parse(), isAdmin, controllers.taoTruyenMoi);

//Cập nhật bộ truyện
router.post('/cap_nhat_bo_truyen', formData.parse(), isAdmin, controllers.capNhatBoTruyen);

//phương thức lấy thông tin chi tiết bộ truyện
router.post('/thong_tin_bo_truyen', formData.parse(), isAdmin, controllers.thongTinChiTietBoTruyen);

//Danh sách tất cả bộ truyện
router.post('/danh_sach_bo_truyen', formData.parse(), isAdmin, controllers.danhSachTatCaBoTruyen);

//Danh sách tất cả bộ truyện 2
router.post('/danh_sach_bo_truyen_2', formData.parse(), isAdmin, controllers.danhSachTatCaBoTruyen_2);

//Cập nhật trạng thái truyện
router.post('/cap_nhat_trang_thai_truyen', formData.parse(), isAdmin, controllers.capNhatTrangThaiTruyen);

//Danh sách tập truyện có thể thêm mới
router.post('/danh_sach_tap_truyen_moi', formData.parse(), isAdmin, controllers.danhSachTapTruyenMoi);

//Tải lên tập truyện mới
router.post('/tai_len_tap_moi', formData.parse(), isAdmin, controllers.taiLenTapTruyenMoi);

//Danh sách tập truyện hiện tại
router.post('/danh_sach_tap_truyen_hien_tai', formData.parse(), isAdmin, controllers.danhSachTapTruyenHienTai);

//Duyệt tập truyện 
router.post('/duyet_tap_truyen', formData.parse(), isAdmin, controllers.duyetTapTruyen);

//Xóa tập truyện 
router.post('/xoa_tap_truyen', formData.parse(), isAdmin, controllers.xoaTapTruyen);

//Cập nhật tập truyện 
router.post('/cap_nhat_tap_truyen', formData.parse(), isAdmin, controllers.capNhatTapTruyen);

//Danh sách tất cả thể loại
router.post('/danh_sach_the_loai', formData.parse(), isAdmin, controllers.danhSachTheLoai);

//Tạo voice
router.post('/tao_voice', formData.parse(), isAdmin, controllers.taoVoice);

//Cập nhật voice
router.post('/cap_nhat_voice', formData.parse(), isAdmin, controllers.capNhatVoice);

//Xóa voice
router.post('/xoa_voice', formData.parse(), isAdmin, controllers.xoaVoice);

//Danh sách key voice
router.post('/danh_sach_key_voice', formData.parse(), isAdmin, controllers.danhSachKeyVoice);

//Thêm mới key voice
router.post('/them_moi_key_voice', formData.parse(), isAdmin, controllers.themMoiKeyVoice);

//Cập nhật key voice
router.post('/cap_nhat_key_voice', formData.parse(), isAdmin, controllers.capNhatKeyVoice);

//Lấy danh sách voice của bộ truyện
router.post('/danh_sach_voice', formData.parse(), isAdmin, controllers.danhSachVoice);

//Lấy danh sách của key api google
router.get('/danh_sach_api_gg', formData.parse(), isAdmin, controllers.danhSachKeyApiGoogle);

//Cập nhật key api google
router.post('/cap_nhat_api_gg', formData.parse(), isAdmin, controllers.capNhatKeyAPIGoogle);

//Kiểm tra kết nối api
router.post('/check_api_gg', formData.parse(), isAdmin, controllers.checkAPIGoogle);

//Danh sách đề xuất
router.post('/danh_sach_de_xuat', formData.parse(), isAdmin, controllers.danhSachDeXuat);

module.exports = router;
