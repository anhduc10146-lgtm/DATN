const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const controllers = require('../controllers/Xac_thuc')
const { checkToken } = require('../middleware')

router.use('/dang_nhap', formData.parse(), controllers.dangNhap);
router.use('/dang_xuat', checkToken, formData.parse(), controllers.dangXuat);
router.use('/dang_ky', formData.parse(), controllers.dangKy);
router.use('/xac_thuc_token', formData.parse(), controllers.xacThucToken);
router.use('/lay_lai_mat_khau', formData.parse(), controllers.layLaiMatKhau);
router.use('/quen_mat_khau', formData.parse(), controllers.quenMatKhau);

module.exports = router;