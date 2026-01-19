// routes/raonhanh.js
const express = require('express');
const router = express.Router();

const QuanLyThongTinRouter = require('./Thanh_vien/QuanLyThongTin')
const QuanLyNapTienRouter = require('./Thanh_vien/QuanLyNapTien')
const QuanLyNangCapRouter = require('./Thanh_vien/QuanLyNangCap')
const QuanLyTruyenRouter = require('./Thanh_vien/QuanLyTruyen')

router.use('/quan_ly_thong_tin', QuanLyThongTinRouter);
router.use('/quan_ly_nap_tien', QuanLyNapTienRouter);
router.use('/quan_ly_nang_cap', QuanLyNangCapRouter);
router.use('/quan_ly_truyen', QuanLyTruyenRouter);


module.exports = router;