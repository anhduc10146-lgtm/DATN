// routes/raonhanh.js
const express = require('express');
const router = express.Router();
const QuanLyTruyenRouter = require('./Su_dung_truyen/Truyen')

router.use('/quan_ly_truyen', QuanLyTruyenRouter);

module.exports = router;