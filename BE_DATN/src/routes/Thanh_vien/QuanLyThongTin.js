// routes/raonhanh.js
const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/Thanh_vien')
const formData = require('express-form-data');
const { checkToken } = require('../../middleware');

//Thông tin tài khoản
router.get('/thong_tin_tai_khoan', checkToken, controllers.thongTinTaiKhoan);

//Cập nhật thông tin cá nhân
router.post('/cap_nhat_thong_tin', checkToken, formData.parse(), controllers.capNhatThongTinCaNhan);

//Cập nhật mật khẩu
router.post('/doi_mat_khau', checkToken, formData.parse(), controllers.doiMatKhau);

module.exports = router;