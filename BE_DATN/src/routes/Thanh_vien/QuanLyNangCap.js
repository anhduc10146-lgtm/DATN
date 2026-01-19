// routes/raonhanh.js
const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/Thanh_vien')
const formData = require('express-form-data');
const { checkToken } = require('../../middleware');

//Nạp tiền vào tài khoản
router.post('/nang_cap_tai_khoan', checkToken, controllers.nangCapTaiKhoan);

//Danh sách gói sở hữu
router.get('/danh_sach_goi_so_huu', checkToken, controllers.danhSachGoiSoHuu);

//Gia hạn gói
router.post('/gia_han_goi', checkToken, controllers.giaHanGoi);

module.exports = router;