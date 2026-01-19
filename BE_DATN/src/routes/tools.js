// routes/raonhanh.js
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/Tools')
const formData = require('express-form-data');

//Tạo dữ liệu mẫu
router.post('/createSeed', formData.parse(), controllers.createSeed);
//Tạo xác truyện
router.post('/tao_xac_truyen', formData.parse(), controllers.taoXacTruyen);
//Xóa xác truyện
router.post('/xoa_xac_truyen', formData.parse(), controllers.xoaXacTruyen);

module.exports = router;