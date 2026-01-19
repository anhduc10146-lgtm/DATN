const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/Quan_tri_vien/QuanLyTaiKhoan');
const formData = require('express-form-data');
const { isAdmin } = require('../../middleware');

//phương thức cập nhật truyện tranh CSDL vật lý vào CSDL 
router.get('/thong_tin_tai_khoan', isAdmin, controllers.thongTinTaiKhoan);

//Cập nhật thông tin cá nhân
router.post('/cap_nhat_thong_tin', isAdmin, formData.parse(), controllers.capNhatThongTinCaNhan);

//Cập nhật mật khẩu
router.post('/doi_mat_khau', isAdmin, formData.parse(), controllers.doiMatKhau);

module.exports = router;
