
const path = require('path');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const app = express();
const Quan_tri_vien = require('../../models/Quan_tri_vien');
const functions = require('../../services/functions');
const functions_qtv = require('../../services/Quan_tri_vien/functions');
const axios = require('axios');
const sharp = require('sharp');
require('dotenv').config();
app.use(express.json());

exports.thongTinTaiKhoan = async (req, res) => {
    try {
        const _id = req.adminId;

        const data = await Quan_tri_vien.findOne({ _id: _id }, '_id ten anhDaiDien ngaySinh gioiTinh taiKhoan soDienThoai email ngayTao ngayCapNhat').then(data => data);
        let info = {};
        info.anhDaiDien = functions_qtv.getUrlAvatar(data.ngayTao, data.anhDaiDien);
        info.ngaySinh = functions_qtv.convertDate(data.ngaySinh, true);
        info.ngayCapNhat = new Date(data.ngayCapNhat - 420 * 60 * 1000);
        info.ngayTao = new Date(data.ngayTao - 420 * 60 * 1000);
        info.gioiTinh = data.gioiTinh;
        info.ten = data.ten;
        info.email = data.email;
        info.soDienThoai = data.soDienThoai;

        return res.status(200).json({
            success: true,
            message: "Thông tin tài khoản",
            content: { ...info }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Thông tin tài khoản",
            content: error.message
        });
    }
}

exports.capNhatThongTinCaNhan = async (req, res) => {
    try {
        const _id = req.adminId;
        const now = functions.getTimeNow();
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id quản trị viên"
            });
        }

        let data = req.body;
        const files = req.files;

        if (data.ngaySinh) {
            data.ngaySinh = new Date(data.ngaySinh);
        }

        if (data.gioiTinh) {
            data.gioiTinh = Number(data.gioiTinh)
        }

        let info = await Quan_tri_vien.findById({ _id: _id }).then(data => data);

        if (files && Object.keys(files).length > 0) {
            const anhDaiDien = await functions_qtv.uploadAvatarResize(files.anhDaiDien, info.ngayTao, 500, 500, info.ten);
            data.anhDaiDien = anhDaiDien;
        }

        await Quan_tri_vien.updateOne({ _id: _id }, { ...data, ngayCapNhat: now })

        info = await Quan_tri_vien.findById({ _id: _id }).then(data => data);

        return res.status(200).json({
            success: true,
            message: "Thông tin tài khoản",
            content: {
                ten: info.ten,
                anhDaiDien: functions_qtv.getUrlAvatar(info.ngayTao, info.anhDaiDien)
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Thông tin tài khoản",
            content: error.message
        });
    }
}

exports.doiMatKhau = async (req, res) => {
    try {
        const _id = req.adminId;
        const now = functions.getTimeNow();
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id quản trị viên"
            });
        }

        const data = req.body;

        let info = await Quan_tri_vien.findById({ _id: _id }).then(data => data);

        // Kiểm tra mật khẩu đối chiếu mật khẩu trong req và database
        if (await bcrypt.compare(data.matKhauCu, info.matKhau)) {
            await Quan_tri_vien.updateOne({ _id: _id }, { matKhau: await bcrypt.hash(data.matKhauMoi, 10) });
            return res.status(200).json({
                success: true,
                message: "Đổi mật khẩu",
                content: "Đổi mật khẩu thành công"
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Đổi mật khẩu",
                content: "Mật khẩu cũ không chính xác"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Đổi mật khẩu",
            content: error.message
        });
    }
}