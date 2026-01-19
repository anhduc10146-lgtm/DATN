// routes/raonhanh.js
const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/Thanh_vien')
const formData = require('express-form-data');
const { checkToken } = require('../../middleware');

//Nạp tiền vào tài khoản
router.post('/nap_tien_vao_tai_khoan', checkToken, controllers.napTienVaoTaiKhoan);

//Danh sách hóa đơn
router.post('/danh_sach_hoa_don', checkToken, controllers.danhSachHoaDon);

module.exports = router;