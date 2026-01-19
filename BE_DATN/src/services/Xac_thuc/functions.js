const Thanh_vien = require('../../models/Thanh_vien');
const Quan_tri_vien = require('../../models/Quan_tri_vien');
const db = require('../../config/db/main');
const bcrypt = require('bcrypt');
db.connect();

// Chuyển file .env sang dạng sử dụng được để lấy thông tin
require('dotenv').config();

// Lấy thông tin người dùng có email và role giống như trong req
exports.layThongTinTaiKhoan = async (data) => {
    let info;
    if (data?.isAdmin == true)
        info = await Quan_tri_vien.findOne({ taiKhoan: data.taiKhoan })
            .then(data => data);

    else
        info = await Thanh_vien.findOne({ taiKhoan: data.taiKhoan })
            .then(data => data);
    return info;
}

// Thêm trường thông tin token cho user
exports.capNhatTaiKhoan = async (isAdmin, data_account) => {
    if (isAdmin == true)
        return Quan_tri_vien.updateOne(
            {
                taiKhoan: data_account.taiKhoan
            }, { token: data_account.token });
    else
        return Thanh_vien.updateOne({
            taiKhoan: data_account.taiKhoan
        }, { token: data_account.token });
}

// Xóa trường thông tin token khi người dùng log out
exports.xoaToken = async (data) => {
    if (data?.isAdmin == 'true') {
        return Quan_tri_vien.updateOne(
            {
                _id: data._id
            }, { token: "" });
    }
    else
        return Thanh_vien.updateOne(
            {
                _id: data._id
            }, { token: "" });
}

// Kiểm tra token của người dùng
exports.checkToken = async (data) => {
    if (data?.isAdmin == 'true') {
        return Quan_tri_vien.findById({ _id: data._id })
            .then(data => data.token)
            .catch(err => 0)
    }
    else
        return Thanh_vien.findById({ _id: data._id })
            .then(data => data.token)
            .catch(err => 0)
}