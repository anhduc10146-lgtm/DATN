// routes/raonhanh.js
const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/Thanh_vien')
const formData = require('express-form-data');
const { checkToken } = require('../../middleware');

//Đề xuất truyện
router.post('/de_xuat_truyen', checkToken, formData.parse(), controllers.deXuatTruyen);

module.exports = router;