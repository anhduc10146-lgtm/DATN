// routes/raonhanh.js
const express = require('express');
const router = express.Router();

const QuanLyTruyenRouter = require('./Quan_tri_vien/QuanLyTruyen')
const QuanLyTaiKhoanRouter = require('./Quan_tri_vien/QuanLyTaiKhoan')
const QuanLyThanhVienRouter = require('./Quan_tri_vien/QuanLyThanhVien')

router.use('/quan_ly_truyen', QuanLyTruyenRouter);
router.use('/quan_ly_thong_tin', QuanLyTaiKhoanRouter);
router.use('/quan_ly_thanh_vien', QuanLyThanhVienRouter);


module.exports = router;