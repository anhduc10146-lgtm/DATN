const path = require('path');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const app = express();
const Thanh_vien = require('../../models/Thanh_vien');
const Thong_bao = require('../../models/Thong_bao');
const Hoa_don = require('../../models/Hoa_don');
const functions = require('../../services/functions');
const functions_tv = require('../../services/Thanh_vien/functions');
const axios = require('axios');
require('dotenv').config();
app.use(express.json());

exports.danhSachThanhVien = async (req, res) => {
    try {
        const _id = req.adminId;
        const { ten = "", email = "", trangThai = "", active = "" } = req.body;
        const currentPage = Number(req.body.currentPage) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let condition = {};

        if (ten != "") {
            condition.ten = { $regex: ten, $options: 'i' };
        }

        if (email != "") {
            condition.email = { $regex: email, $options: 'i' };
        }

        if (trangThai != "") {
            condition.trangThai = Number(trangThai);
        }

        if (active != "") {
            condition.active = Number(active);
        }

        const list = await Thanh_vien.aggregate([
            { $match: condition },
            { $sort: { ngayTao: -1 } },
            { $skip: (currentPage - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: "Theloai",
                    localField: "theLoaiYeuThich",
                    foreignField: "id",
                    as: "chiTietTheLoai"
                }
            },
            {
                $lookup: {
                    from: "Botruyen",
                    localField: "truyenDaDoc",
                    foreignField: "_id",
                    as: "chiTietTruyenDaDoc"
                }
            },
            {
                $lookup: {
                    from: "Botruyen",
                    localField: "truyenYeuThich",
                    foreignField: "_id",
                    as: "chiTietTruyenYeuThich"
                }
            },
            {
                $project: {
                    _id: 1,
                    ten: 1,
                    email: 1,
                    taiKhoan: 1,
                    gioiTinh: 1,
                    ngayTao: 1,
                    ngayCapNhat: 1,
                    diaChi: 1,
                    trangThai: 1,
                    active: 1,
                    ngaySinh: 1,
                    anhDaiDien: 1,
                    soDienThoai: 1,
                    soDuTaiKhoan: 1,
                    theLoaiYeuThich: 1,
                    chiTietTheLoaiYeuThich: {
                        $map: {
                            input: "$chiTietTheLoai",
                            as: "theLoai",
                            in: "$$theLoai.ten"
                        }
                    },
                    truyenDaDoc: 1,
                    chiTietTruyenDaDoc: {
                        $map: {
                            input: "$chiTietTruyenDaDoc",
                            as: "truyen",
                            in: "$$truyen.ten",
                        }
                    },
                    truyenYeuThich: 1,
                    chiTietTruyenYeuThich: {
                        $map: {
                            input: "$chiTietTruyenYeuThich",
                            as: "truyenYeuThich1",
                            in: "$$truyenYeuThich1.ten"
                        }
                    }
                }
            }
        ]);
        const count = await Thanh_vien.countDocuments(condition);

        const processedList = list.map(member => ({
            ...member,
            anhDaiDien: functions_tv.getUrlAvatar(member.ngayTao, member.anhDaiDien),
            ngaySinh: functions_tv.convertDate(member.ngaySinh, true),
            ngayTao: new Date(member.ngayTao - 420 * 60 * 1000),
            ngayCapNhat: new Date(member.ngayCapNhat - 420 * 60 * 1000),
        }));

        return res.status(200).json({
            success: true,
            message: "Danh sách thành viên",
            content: {
                processedList,
                count
            }
        });
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Danh sách thành viên",
            content: error.message
        });
    }
}

exports.capNhatThongTinThanhVien = async (req, res) => {
    try {
        const _id = req.adminId;
        const now = functions.getTimeNow();

        const _idThanhVien = req.body._id;
        if (!_idThanhVien) {
            return res.status(400).json({
                success: false,
                message: "Cập nhật thông tin thành viên",
                content: "Không tìm thấy id thành viên"
            });
        }

        const data = req.body;
        const files = req.files;

        let info = await Thanh_vien.findById({ _id: _idThanhVien }).then(data => data);

        if (files && Object.keys(files).length > 0) {
            const anhDaiDien = await functions_tv.uploadAvatarResize(files.anhDaiDien, info.ngayTao, 500, 500, info.ten);
            data.anhDaiDien = anhDaiDien;
        }

        await Thanh_vien.updateOne(
            { _id: _idThanhVien },
            {
                ...data,
                gioiTinh: Number(data.gioiTinh),
                trangThai: Number(data.trangThai),
                active: Number(data.active),
                soDuTaiKhoan: Number(data.soDuTaiKhoan),
                ngaySinh: new Date(data.ngaySinh),
                ngayCapNhat: now
            });

        return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin thành viên",
            content: "Cập nhật thông tin thành viên thành công"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cập nhật thông tin thành viên",
            content: error.message
        });
    }
}

exports.thayDoiTrangThaiThanhVien = async (req, res) => {
    try {
        const now = functions.getTimeNow();

        const _idThanhVien = req.body._id;
        if (!_idThanhVien) {
            return res.status(400).json({
                success: false,
                message: "Cập nhật thông tin thành viên",
                content: "Không tìm thấy id thành viên"
            });
        }

        if (req.body.trangThai == "0" || req.body.trangThai == "1") {
            await Thanh_vien.updateOne(
                { _id: _idThanhVien },
                {
                    trangThai: Number(req.body.trangThai),
                    ngayCapNhat: now
                }
            );
        }
        else {
            await Thanh_vien.updateOne(
                { _id: _idThanhVien },
                [
                    {
                        $set: {
                            trangThai: {
                                $cond: { if: { $eq: ["$trangThai", 0] }, then: 1, else: 0 },
                            },
                            ngayCapNhat: now
                        },
                    },
                ]
            );
        }

        return res.status(200).json({
            success: true,
            message: "Thay đổi trạng thái",
            content: "Thay đổi trạng thái thành viên thành công"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Thay đổi trạng thái",
            content: error.message
        });
    }
}

exports.danhSachThongBao = async (req, res) => {
    try {
        const _id = req.adminId;
        const { loai = "", trangThai = "", idThanhVien = "", tuNgay = "", denNgay = "" } = req.body;
        const currentPage = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 10;

        let condition = {};

        if (tuNgay !== "" && denNgay !== "") {
            condition.ngayTao = {
                $gte: functions._getTime(tuNgay),
                $lte: functions._getTime(denNgay) + 1439 * 60 * 1000,
            };
        } else if (tuNgay !== "") {
            condition.ngayTao = {
                $gte: functions._getTime(tuNgay),
            };
        } else if (denNgay !== "") {
            condition.ngayTao = {
                $lte: functions._getTime(denNgay) + 1439 * 60 * 1000,
            };
        }

        if (loai != "") {
            condition.loai = Number(loai);
        }

        if (trangThai != "") {
            condition.trangThai = Number(trangThai);
        }

        if (idThanhVien != "") {
            condition.maThanhVien = ObjectId(idThanhVien);
        }

        const list = await Thong_bao.aggregate([
            { $match: condition },
            { $sort: { trangThai: 1, id: -1 } },
            { $skip: (currentPage - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: "Thanhvien",
                    localField: "maThanhVien",
                    foreignField: "_id",
                    as: "thanhVienDetails",
                },
            },
            { $unwind: { path: "$thanhVienDetails", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    thanhVienId: "$thanhVienDetails._id",
                    thanhVienTen: "$thanhVienDetails.ten",
                },
            },
            {
                $lookup: {
                    from: "Hoadon",
                    localField: "maHoaDon",
                    foreignField: "_id",
                    as: "hoaDonDetails",
                },
            },
            { $unwind: { path: "$hoaDonDetails", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    hoaDon: "$hoaDonDetails",
                },
            },
            {
                $lookup: {
                    from: "Dexuat",
                    localField: "maDeXuat",
                    foreignField: "_id",
                    as: "deXuatDetails",
                },
            },
            { $unwind: { path: "$deXuatDetails", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    deXuat: "$deXuatDetails",
                },
            },
            {
                $project: {
                    thanhVienDetails: 0,
                    hoaDonDetails: 0,
                    deXuatDetails: 0
                },
            },
        ])

        const count = await Thong_bao.countDocuments(condition);

        return res.status(200).json({
            success: true,
            message: "Danh sách thông báo",
            content: list,
            total: count
        });
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Danh sách thông báo",
            content: error.message
        });
    }
}

exports.doiTrangThaiThongBao = async (req, res) => {
    try {
        const now = functions.getTimeNow();
        const idThongBao = req.body._id;

        //Nếu truyền vào trường danhDauTatCa = "1" thì thay đổi tất cả thông báo về đã xem
        const danhDauTatCa = req.body.danhDauTatCa;

        if (danhDauTatCa && danhDauTatCa == "1")
            await Thong_bao.updateMany({ trangThai: 0 }, { trangThai: 1, ngayXem: now })
        else {
            if (!idThongBao)
                return res.status(400).json({
                    success: false,
                    message: "Đổi trạng thái thông báo",
                    content: "Chưa truyền vào trường id thông báo"
                });
            else
                await Thong_bao.updateOne({ _id: ObjectId(idThongBao) }, { trangThai: 1, ngayXem: now })
        }

        return res.status(200).json({
            success: true,
            message: "Đổi trạng thái thông báo",
            content: "Đổi thành công",
        });
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Đổi trạng thái thông báo",
            content: error.message
        });
    }
}

exports.doiTrangThaiHoaDon = async (req, res) => {
    try {
        const idHoaDon = req.body.id;
        const trangThai = req.body.trangThai;

        await Hoa_don.updateOne({ id: Number(idHoaDon) }, { trangThai: Number(trangThai) })
        return res.status(200).json({
            success: true,
            message: "Đổi trạng thái hóa đơn",
            content: "Đổi trạng thái thành công",
        });
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Đổi trạng thái hóa đơn",
            content: error.message
        });
    }
}

exports.soLuongThongBaoChuaDoc = async (req, res) => {
    try {
        const count = await Thong_bao.countDocuments({ trangThai: 0 })
        return res.status(200).json({
            success: true,
            message: "Số lượng thông báo chưa đọc",
            content: count,
        });
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Số lượng thông báo chưa đọc",
            content: error.message
        });
    }
}

