const path = require('path');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const app = express();
const Bo_truyen = require('../../models/Bo_truyen');
const The_loai = require('../../models/The_loai');
const Key_voice = require('../../models/Key_voice');
const Thanh_vien = require('../../models/Thanh_vien');
const Voice = require('../../models/Voice');
const Truyen = require('../../models/Truyen');
const De_xuat = require('../../models/De_xuat');
const functions = require('../../services/functions');
const functions_bt = require('../../services/Bo_truyen/functions');
const axios = require('axios');
const sharp = require('sharp');
const socket = require('../../config/socket')
require('dotenv').config();
app.use(express.json());


exports.danhSachTheLoai = async (req, res) => {
    try {
        const data = req.body;
        const page = Number(data.page) || 1;
        const pageSize = Number(data.pageSize) || 10;
        const ten = req.ten || "";

        const condition = {
            trangThai: 1,
            ten: { $regex: ten, $options: 'i' }
        };

        const data_the_loai = await The_loai.aggregate([
            { $match: condition },
            { $sort: { id: 1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    _id: 1,
                    ten: 1,
                    id: 1,
                    parent_id: 1,
                    moTa: 1,
                    ngayTao: 1,
                    ngayCapNhat: 1
                }
            }
        ])

        return res.status(200).json({
            success: true,
            message: `Danh sách thể loại`,
            content: data_the_loai
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Danh sách thể loại",
            content: err.message
        });
    }
}

exports.danhSachBoTruyen = async (req, res) => {
    try {
        const data = req.body;
        const page = Number(data.page) || 1;
        const pageSize = Number(data.pageSize) || 10;
        const condition = {
            trangThai: 2
        };

        if (data.ten) {
            condition.ten = { $regex: ten, $options: 'i' }
        }

        if (data.theLoai) {
            condition.theLoai = { $in: [Number(data.theLoai)] }
        }

        const data_bo_truyen = await Bo_truyen.aggregate([
            { $match: condition },
            { $sort: { ngayDang: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: "Truyen",
                    let: { boTruyenId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$maBoTruyen", "$$boTruyenId"] },
                                        { $eq: ["$trangThai", 2] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "danhSachTruyen"
                }
            },
            {
                $addFields: {
                    soLuongTruyen: { $size: "$danhSachTruyen" }
                }
            },
            {
                $lookup: {
                    from: "Theloai",
                    localField: "theLoai",
                    foreignField: "id",
                    as: "danhSachTheLoai"
                }
            },
            {
                $project: {
                    _id: 1,
                    ten: 1,
                    soTap: 1,
                    trangThai: 1,
                    tomTat: 1,
                    tacGia: 1,
                    theLoai: 1,
                    theLoaiString: "$danhSachTheLoai.ten",
                    ngayDang: 1,
                    ngayTao: 1,
                    thoiGianCapNhat: 1,
                    gioiHanQuyenDoc: 1,
                    gioiHanLuaTuoi: 1,
                    soLuotTruyCap: 1,
                    giaBanQuyen: 1,
                    giaBan: 1,
                    trangBia: 1,
                    soLuongTruyen: 1
                }
            }
        ])

        const processedList = data_bo_truyen.map(data => ({
            ...data,
            trangBia: functions_bt.getUrlCover(data.ngayTao, data.trangBia),
            ngayDang: functions_bt.convertDate(data.ngayDang, true),
            ngayTao: new Date(data.ngayTao - 420 * 60 * 1000),
            thoiGianCapNhat: new Date(data.thoiGianCapNhat - 420 * 60 * 1000),
        }));

        const count = await Bo_truyen.countDocuments(condition);

        return res.status(200).json({
            success: true,
            message: `Lấy danh sách bộ truyện`,
            content: processedList,
            total: count
        });
    }
    catch (err) {
        console.log(err.message)
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err.message
        });
    }
}

exports.tangSoLuotTruyCap = async (req, res) => {
    try {
        const data = req.body;
        const _id = data._id;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: `Tăng số lượt truy cập`,
                content: 'Vui lòng nhập _id bộ truyện'
            });
        }

        const data_bt = await Bo_truyen.findById({ _id: _id }).then(data => data);

        if (!data_bt) {
            return res.status(400).json({
                success: false,
                message: `Tăng số lượt truy cập`,
                content: 'Không tìm thấy bộ truyện'
            });
        }

        await Bo_truyen.updateOne({ _id: _id }, { soLuotTruyCap: data_bt.soLuotTruyCap + 1 })

        return res.status(200).json({
            success: true,
            message: `Tăng số lượt truy cập`,
            content: 'Tăng số lượt truy cập thành công'
        });
    }
    catch (err) {
        console.log(err.message)
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err.message
        });
    }
}

exports.chiTietBoTruyen = async (req, res) => {
    try {
        const userId = req.userId;
        const data = req.body;
        const _id = data._id;
        const isAdmin = data.isAdmin;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: `Chi tiết bộ truyện`,
                content: 'Vui lòng nhập _id bộ truyện'
            });
        }

        let tapDaDoc = 0;
        let yeuThich = 0;

        if (isAdmin === 'false') {
            const data_tv = await Thanh_vien.findById({ _id: ObjectId(userId) }).then(data => data);

            const index = data_tv.truyenDaDoc.findIndex(
                (id) => id.toString() === _id
            );

            const index_2 = data_tv.truyenYeuThich.findIndex(
                (item) => item.toString() === _id
            );
            tapDaDoc = index !== -1 ? data_tv.tapDaDoc[index] : 0;
            yeuThich = index_2 !== -1 ? 1 : 0;
        }

        const condition = {
            _id: ObjectId(_id)
        }

        const data_bo_truyen = await Bo_truyen.aggregate([
            { $match: condition },
            {
                $lookup: {
                    from: "Truyen",
                    let: { boTruyenId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$maBoTruyen", "$$boTruyenId"] },
                                        { $eq: ["$trangThai", 2] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "danhSachTruyen"
                }
            },
            {
                $lookup: {
                    from: "Theloai",
                    localField: "theLoai",
                    foreignField: "id",
                    as: "danhSachTheLoai"
                }
            },
            {
                $project: {
                    _id: 1,
                    ten: 1,
                    soTap: 1,
                    trangThai: 1,
                    tomTat: 1,
                    tacGia: 1,
                    theLoai: 1,
                    theLoaiString: "$danhSachTheLoai.ten",
                    ngayDang: 1,
                    ngayTao: 1,
                    thoiGianCapNhat: 1,
                    gioiHanQuyenDoc: 1,
                    gioiHanLuaTuoi: 1,
                    soLuotTruyCap: 1,
                    giaBanQuyen: 1,
                    giaBan: 1,
                    trangBia: 1,
                    soLuongTruyen: 1,
                    danhSachTruyen: '$danhSachTruyen'
                }
            }
        ])

        const data_voice = await Voice.find({ maBoTruyen: ObjectId(_id) }, { voiceUrl: 1, ten: 1 }).sort({ id: 1 });;

        const processedList = data_bo_truyen.map(data => ({
            ...data,
            trangBia: functions_bt.getUrlCover(data.ngayTao, data.trangBia),
            ngayDang: new Date(data.ngayDang),
            danhSachAmThanh: data_voice,
            daDoc: tapDaDoc,
            yeuThich: yeuThich
        }));

        return res.status(200).json({
            success: true,
            message: `Chi tiết bộ truyện`,
            content: processedList
        });
    }
    catch (err) {
        console.log(err.message)
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err.message
        });
    }
}

exports.danhDauYeuThich = async (req, res) => {
    try {
        const userId = req.userId;
        const data = req.body;
        const _id = data._id;
        const isAdmin = data.isAdmin;
        const trangThai = data.trangThai;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: `Đánh dấu yêu thích`,
                content: 'Vui lòng nhập _id bộ truyện'
            });
        }

        const data_bt = await Bo_truyen.findById({ _id: _id }).then(data => data);

        if (!data_bt) {
            return res.status(400).json({
                success: false,
                message: `Đánh dấu yêu thích`,
                content: 'Không tìm thấy bộ truyện'
            });
        }

        const theLoai = data_bt.theLoai;

        if (isAdmin === 'false') {
            if (trangThai === 'true') {

                await Thanh_vien.updateOne(
                    { _id: ObjectId(userId) },
                    {
                        $addToSet: {
                            truyenYeuThich: ObjectId(_id),
                            theLoaiYeuThich: { $each: theLoai }
                        }
                    }
                );
            }
            else {
                await Thanh_vien.updateOne(
                    { _id: ObjectId(userId), truyenYeuThich: ObjectId(_id) },
                    { $pull: { truyenYeuThich: ObjectId(_id) } }
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: `Đánh dấu yêu thích`,
            content: 'Đánh dấu yêu thích thành công'
        });
    }
    catch (err) {
        console.log(err.message)
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err.message
        });
    }
}

exports.checkVip = async (req, res) => {
    try {
        const userId = req.userId;
        const data = req.body;
        const isAdmin = data.isAdmin;

        if (isAdmin === 'false') {
            const data_tv = await Thanh_vien.findById(
                { _id: ObjectId(userId) }
            ).then(data => data);

            if (data_tv.active !== 2) {
                return res.status(400).json({
                    success: false,
                    message: `Kiểm tra gói vip`,
                    content: 'Bạn chưa phải là thành viên vip, chưa thể sử dụng chức năng này'
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: `Kiểm tra gói vip`,
            content: 'Bạn đang là thành viên vip'
        });
    }
    catch (err) {
        console.log(err.message)
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err.message
        });
    }
}

exports.danhSachTrangTruyen = async (req, res) => {
    try {
        const userId = req.userId;
        const _id = req.body.idBoTruyen || "";
        const tap = Number(req.body.tap) || 0;
        const isAdmin = req.body.isAdmin || "";

        if (_id === "" || tap === 0) {
            return res.status(400).json({
                success: false,
                message: "Danh sách trang truyện",
                content: "Chưa truyền đủ trường, _id, tap"
            });
        }

        if (isAdmin === 'false') {
            const data_tv = await Thanh_vien.findById({ _id: ObjectId(userId) }).then(data => data);
            let truyenDaDoc = data_tv.truyenDaDoc;
            let tapDaDoc = data_tv.tapDaDoc;

            const index = truyenDaDoc.findIndex(item => item.toString() === _id);
            if (index !== -1) {
                if (tapDaDoc[index] < tap) {
                    tapDaDoc[index] = tap;
                }
            } else {
                truyenDaDoc.push(ObjectId(_id));
                tapDaDoc.push(tap);
            }
            await Thanh_vien.update({ _id: ObjectId(userId) }, { truyenDaDoc: truyenDaDoc, tapDaDoc, tapDaDoc });
        }

        const data_truyen = await Bo_truyen.aggregate([
            {
                $match: {
                    _id: ObjectId(_id)
                }
            },
            {
                $lookup: {
                    from: "Truyen",
                    localField: "_id",
                    foreignField: "maBoTruyen",
                    as: "truyens"
                }
            },
            {
                $unwind: "$truyens"
            },
            {
                $match: {
                    "truyens.tap": tap
                }
            },
            {
                $project: {
                    _id: 1,
                    ten: 1,
                    url_truyen: "$truyens.url",
                    tap: "$truyens.tap",
                    idTruyen: "$truyens.id"
                }
            }
        ]);

        const danhSachTrangTruyen = await functions.getListFileFromDrive(data_truyen[0].url_truyen)

        const list = data_truyen.map(member => ({
            ...member,
            danhSachTrangTruyen: danhSachTrangTruyen
        }));

        return res.status(200).json({
            success: true,
            message: "Danh sách trang truyện",
            content: list
        });
    }
    catch (err) {
        console.log(err.message)
        return res.status(400).json({
            success: false,
            message: "Danh sách trang truyện",
            content: err.message
        });
    }
}

exports.danhSachTapTruyenHienThi = async (req, res) => {
    try {
        const _id = req.body.idBoTruyen || "";

        if (_id === "") {
            return res.status(400).json({
                success: false,
                message: "Danh sách tập truyện",
                content: "Chưa truyền đủ trường idBoTruyen"
            });
        }

        const data_truyen = await Truyen.aggregate([
            {
                $match: {
                    maBoTruyen: ObjectId(_id),
                    trangThai: 2
                }
            },
            {
                $project: {
                    _id: 1,
                    id: 1,
                    tap: 1,
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: "Danh sách trang truyện",
            content: data_truyen
        });
    }
    catch (err) {
        console.log(err.message)
        return res.status(400).json({
            success: false,
            message: "Danh sách trang truyện",
            content: err.message
        });
    }
}

exports.danhSachTruyenYeuThich = async (req, res) => {
    try {
        const userId = req.userId;

        if (userId === "") {
            return res.status(400).json({
                success: false,
                message: "Danh sách truyện yêu thích",
                content: "Vui lòng kiểm tra lại trạng thái đăng nhập"
            });
        }
        const the_loai = await The_loai.find({}, { id: 1, ten: 1 });
        const id_bo_truyen = await Thanh_vien.findById({ _id: ObjectId(userId) }, { truyenYeuThich: 1 }).then(data => data);


        const data_truyen = await Bo_truyen.aggregate([
            {
                $match: {
                    _id: { $in: id_bo_truyen.truyenYeuThich }
                }
            },
            {
                $lookup: {
                    from: "Theloai",
                    localField: "theLoai",
                    foreignField: "id",
                    as: "danhSachTheLoai"
                }
            },
            {
                $project: {
                    _id: 1,
                    ten: 1,
                    soTap: 1,
                    trangThai: 1,
                    tomTat: 1,
                    tacGia: 1,
                    theLoai: 1,
                    theLoaiString: "$danhSachTheLoai.ten",
                    ngayDang: 1,
                    ngayTao: 1,
                    thoiGianCapNhat: 1,
                    gioiHanQuyenDoc: 1,
                    gioiHanLuaTuoi: 1,
                    soLuotTruyCap: 1,
                    giaBanQuyen: 1,
                    giaBan: 1,
                    trangBia: 1,
                    soLuongTruyen: 1,
                }
            }
        ])

        const processedList = data_truyen.map(data => ({
            ...data,
            trangBia: functions_bt.getUrlCover(data.ngayTao, data.trangBia)
        }));

        return res.status(200).json({
            success: true,
            message: "Danh sách truyện yêu thích",
            content: processedList
        });
    }
    catch (err) {
        console.log(err.message)
        return res.status(400).json({
            success: false,
            message: "Danh sách truyện yêu thích",
            content: err.message
        });
    }
}
