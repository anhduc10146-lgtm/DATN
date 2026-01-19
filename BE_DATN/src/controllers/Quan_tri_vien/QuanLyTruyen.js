const path = require('path');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const app = express();
const Bo_truyen = require('../../models/Bo_truyen');
const The_loai = require('../../models/The_loai');
const Key_voice = require('../../models/Key_voice');
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

exports.taoTruyenMoi = async (req, res) => {
    try {
        // Kiểm tra các trường trong req.body
        for (const field of ["ten", "tomTat", "theLoai", "gioiHanQuyenDoc", "gioiHanLuaTuoi", "giaBanQuyen"]) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `Trường '${field}' không được để trống hoặc undefined` });
            }
        }

        // Kiểm tra các trường trong req.files
        for (const fileField of ["trangBia", "tapTruyen"]) {
            if (!req.files || !req.files[fileField]) {
                return res.status(400).json({ success: false, message: `File '${fileField}' không được để trống hoặc undefined` });
            }
        }

        const data = req.body;
        const data_file = req.files;
        const now = functions.getTimeNow();

        //Các thông tin cơ bản của truyện
        const ten = data.ten;
        const ten_drive = functions.standardized(ten);
        const check = await functions.getIdFolderDrive(ten_drive);
        if (check == "") {
            const id_folder = await functions.createFolder(ten_drive);
            const id_chap_1 = await functions.createFolder('chap_1', id_folder);
            const so_tap = 1;
            const trang_thai = 1;
            const tom_tat = data.tomTat;
            const tac_gia = data.tacGia || "Đang cập nhật";
            const the_loai = data.theLoai.map((item) => Number(item));
            const gioi_han_quyen_doc = Number(data.gioiHanQuyenDoc) || 0;
            const gioi_han_lua_tuoi = Number(data.gioiHanLuaTuoi) || 0;
            const gia_ban_quyen = Number(data.giaBanQuyen) || 0;
            const so_luot_truy_cap = 0;
            const ngay_dang = now;
            const thoi_gian_cap_nhat = now;
            const trang_bia = await functions_bt.uploadCoverResize(data_file.trangBia, now);
            const so_trang = data_file.tapTruyen.length;
            const tap = 1;
            const tom_tat_truyen = '';
            const so_luot_truy_cap_truyen = 0;

            const new_bo_truyen = await Bo_truyen.create({
                ten: ten,
                soTap: so_tap,
                trangThai: trang_thai,
                tomTat: tom_tat,
                tacGia: tac_gia,
                theLoai: the_loai,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: gioi_han_quyen_doc,
                gioiHanLuaTuoi: gioi_han_lua_tuoi,
                soLuotTruyCap: so_luot_truy_cap,
                giaBanQuyen: gia_ban_quyen,
                trangBia: trang_bia
            })
                .then(data => data)
                .catch(error => {
                    console.error("Lỗi khi tạo bộ truyện:", error);
                    throw error;
                });

            const idTruyen = await functions.getMaxId().then(data => data.maxIdT);
            //Thêm tập truyện đầu tiên
            const new_chap = await Truyen.create({
                id: idTruyen + 1,
                soTrang: so_trang,
                tap: tap,
                url: id_chap_1,
                tomTat: tom_tat_truyen,
                ngayDang: ngay_dang,
                ngayCapNhat: thoi_gian_cap_nhat,
                soLuotTruyCap: so_luot_truy_cap_truyen,
                trangThai: 4,
                maBoTruyen: new_bo_truyen._id
            })

            // Tạo bộ truyện mới
            setImmediate(async () => {
                try {
                    await functions.uploadImgToDriveAndResize(data_file.tapTruyen, id_chap_1);
                    await Truyen.updateOne({ _id: new_chap._id }, { trangThai: 1 });
                    socket.emit('uploadTruyen', {
                        success: true,
                        message: `Tập ${Number(tap)} của bộ truyện "${ten}" đã tải lên drive`
                    })
                } catch (error) {
                    socket.emit('uploadTruyen', {
                        success: false,
                        message: `Tập ${Number(data.tapSo)} của bộ truyện ${data_bo_truyen.ten} tải lên bị lỗi, vui lòng kiểm tra drive`
                    })
                    console.error('Lỗi khi upload ảnh:', error);
                }
            });

            return res.status(200).json({
                success: true,
                message: "Tạo truyên mới",
                content: "Tạo truyện mới thành công, quá trình tải tập mới lên drive đang diễn ra"
            });
        }
        else {
            console.log(`Bộ truyện đã tồn tại hoặc trùng tên trên drive vui lòng kiểm tra lại`);
            return res.status(400).json({
                success: false,
                message: "Tạo truyên mới",
                content: "Bộ truyện đã tồn tại hoặc trùng tên trên drive vui lòng kiểm tra lại"
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Tạo truyên mới",
            content: err.message

        });
    }
}

exports.capNhatBoTruyen = async (req, res) => {
    try {
        const now = functions.getTimeNow();
        const _idBoTruyen = req.body._id;

        if (!_idBoTruyen) {
            return res.status(400).json({
                success: false,
                message: "Cập nhật bộ truyện",
                content: "Không tìm thấy id bộ truyện"
            });
        }

        let data = req.body;
        const files = req.files;

        Array.isArray(data.theLoai) ? data.theLoai.map(item => Number(item)) : data.theLoai = [Number(data.theLoai)];
        data.trangThai = Number(data.trangThai);
        data.gioiHanQuyenDoc = Number(data.gioiHanQuyenDoc);
        data.gioiHanLuaTuoi = Number(data.gioiHanLuaTuoi) || 0;
        data.soLuotTruyCap = Number(data.soLuotTruyCap) || 0;
        data.giaBanQuyen = Number(data.giaBanQuyen) || 0;
        data.giaBan = Number(data.giaBan) || 0;

        let info = await Bo_truyen.findById({ _id: _idBoTruyen }).then(data => data);

        if (files && Object.keys(files).length > 0) {
            const trangBia = await functions_bt.uploadCoverResize(files.trangBia, info.ngayDang);
            data.trangBia = trangBia;
        }

        await Bo_truyen.updateOne(
            { _id: _idBoTruyen },
            {
                ...data,
                thoiGianCapNhat: now
            });

        return res.status(200).json({
            success: true,
            message: "Cập nhật bộ truyện",
            content: "Cập nhật bộ truyện thành công"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cập nhật bộ truyện",
            content: error.message
        });
    }
}

exports.thongTinChiTietBoTruyen = async (req, res) => {
    try {
        // Kiểm tra các trường trong req.body
        for (const field of ["_id"]) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `Trường '${field}' không được để trống hoặc undefined` });
            }
        }

        const data = req.body;
        const _id = data._id;
        const data_the_loai = await The_loai.find({}, { _id: 0, ten: 1, id: 1 });

        const data_bo_truyen = await Bo_truyen.findById({ _id: _id }).then((data) => {
            const _id = data._id;
            const ten = data.ten;
            const soTap = data.soTap;
            const trangThai = data.trangThai == 0 ? "Đã xóa" : (data.trangThai == 1 ? "Chờ duyệt" : (data.trangThai == 2 ? "Phát hành" : "Đã gỡ"));
            const tomTat = data.tomTat;
            const tacGia = data.tacGia;
            const theLoai = data_the_loai.filter(item => data.theLoai.includes(item.id)).map(item => item.ten);;
            const ngayDang = functions.convertDate(data.ngayDang);
            const thoiGianCapNhat = functions.convertDate(data.thoiGianCapNhat);
            const gioiHanQuyenDoc = data.gioiHanQuyenDoc;
            const gioiHanLuaTuoi = data.gioiHanLuaTuoi;
            const soLuotTruyCap = data.soLuotTruyCap;
            const giaBanQuyen = data.giaBanQuyen;
            const giaBan = data.giaBan;
            const trangBia = functions_bt.getUrlCover(data.ngayTao, data.trangBia);
            return {
                _id: _id,
                ten: ten,
                soTap: soTap,
                trangThai: trangThai,
                tomTat: tomTat,
                tacGia, tacGia,
                theLoai: theLoai,
                ngayDang: ngayDang,
                thoiGianCapNhat: thoiGianCapNhat,
                gioiHanQuyenDoc: gioiHanQuyenDoc,
                gioiHanLuaTuoi: gioiHanLuaTuoi,
                soLuotTruyCap: soLuotTruyCap,
                giaBanQuyen: giaBanQuyen,
                giaBan: giaBan,
                trangBia: trangBia
            };
        });

        console.log(`Lấy thông tin bộ truyện ${data_bo_truyen.ten} thành công`)

        return res.status(200).json({
            success: true,
            message: `Lấy thông tin bộ truyện ${data_bo_truyen.ten} thành công`,
            content: data_bo_truyen
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err
        });
    }
}

exports.danhSachTatCaBoTruyen = async (req, res) => {
    try {
        const data = req.body;

        const ten = data.ten;
        const condition = {
            ten: { $regex: ten, $options: 'i' }
        };

        const data_bo_truyen = await Bo_truyen.aggregate([
            { $match: condition },
            {
                $lookup: {
                    from: "Theloai", // Tên collection thể loại
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
                    theLoai: "$danhSachTheLoai.ten",
                    ngayDang: 1,
                    thoiGianCapNhat: 1,
                    gioiHanQuyenDoc: 1,
                    gioiHanLuaTuoi: 1,
                    soLuotTruyCap: 1,
                    giaBanQuyen: 1,
                    giaBan: 1,
                    trangBia: 1
                }
            }
        ])

        const processedList = data_bo_truyen.map(data => ({
            ...data,
            trangBia: functions_bt.getUrlCover(data.ngayTao, data.trangBia),
            ngayDang: functions.convertDate(data.ngayDang),
            thoiGianCapNhat: functions.convertDate(data.thoiGianCapNhat),
        }));

        return res.status(200).json({
            success: true,
            message: `Lấy danh sách bộ truyện`,
            content: processedList
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err
        });
    }
}

exports.danhSachTatCaBoTruyen_2 = async (req, res) => {
    {
        try {
            const data = req.body;
            const page = Number(data.page) || 1;
            const pageSize = Number(data.pageSize) || 10;
            const condition = {};

            if (data.ten) {
                condition.ten = { $regex: ten, $options: 'i' }
            }

            if (data.trangThai) {
                condition.trangThai = Number(data.trangThai);
            }

            const data_bo_truyen = await Bo_truyen.aggregate([
                { $match: condition },
                { $sort: { ngayTao: -1 } },
                { $skip: (page - 1) * pageSize },
                { $limit: pageSize },
                {
                    $lookup: {
                        from: "Truyen",
                        localField: "_id",
                        foreignField: "maBoTruyen",
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
                count: Math.ceil(count / pageSize),
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
}

exports.capNhatTrangThaiTruyen = async (req, res) => {
    {
        try {
            const data = req.body;
            const _id = data._id;
            const trangThai = data.trangThai;
            const now = functions.getTimeNow();
            let data_update = {};
            let content = "";
            if (Number(trangThai) === 2) {
                data_update = {
                    trangThai: Number(trangThai),
                    thoiGianCapNhat: now,
                    ngayDang: now
                }
                content = "Đăng truyện thành công"
            }
            else {
                data_update = {
                    trangThai: Number(trangThai),
                    thoiGianCapNhat: now
                }
                content = "Cập nhật trạng thái thành công"
            }


            await Bo_truyen.updateOne({ _id: _id }, { ...data_update })


            return res.status(200).json({
                success: true,
                message: `Cập nhật trạng thái`,
                content: content,
            });
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: "Có lỗi xảy ra",
                content: err
            });
        }
    }
}

exports.danhSachTapTruyenMoi = async (req, res) => {
    try {
        const data = req.body;

        const _idBoTruyen = data._idBoTruyen;

        const list = await Truyen.find({ maBoTruyen: _idBoTruyen }, { _id: 0, tap: 1 }).then(data => {
            const sortedList = data.sort((a, b) => a.tap - b.tap);

            // Tìm các số bị thiếu trong dãy
            const soThieu = [];
            let maxNumber = sortedList[sortedList.length - 1]?.tap || 0;  // Lấy số lớn nhất từ danh sách

            // Duyệt qua mảng để tìm các số bị thiếu
            for (let i = 0; i < sortedList.length - 1; i++) {
                const current = sortedList[i].tap;
                const next = sortedList[i + 1].tap;

                for (let j = current + 1; j < next; j++) {
                    soThieu.push(j);
                }
            }

            // Thêm số lớn nhất + 1 vào mảng soThieu
            soThieu.push(maxNumber + 1);

            return soThieu;
        });

        return res.status(200).json({
            success: true,
            message: `Danh sách tập truyện`,
            content: list
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Danh sách tập truyện",
            content: err.message
        });
    }
}

exports.danhSachTapTruyenHienTai = async (req, res) => {
    try {
        const data = req.body;
        const page = Number(data.page) || 1;
        const pageSize = Number(data.pageSize) || 10;
        const tapSo = Number(data.tapSo);
        const trangThai = Number(data.trangThai);
        const _idBoTruyen = data.idBoTruyen;
        const maBoTruyen = _idBoTruyen ? ObjectId(_idBoTruyen) : undefined;

        const condition = {
            maBoTruyen: maBoTruyen
        };

        // Thêm điều kiện lọc nếu có
        if (tapSo) {
            condition.tap = tapSo;
        }
        if (trangThai) {
            condition.trangThai = trangThai;
        }

        const list = await Truyen.aggregate([
            { $match: condition },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    _id: 1,
                    id: 1,
                    soTrang: 1,
                    tap: 1,
                    url: 1,
                    tomTat: 1,
                    ngayDang: 1,
                    ngayCapNhat: 1,
                    soLuotTruyCap: 1,
                    trangThai: 1,
                }
            }
        ]);



        const count = await Truyen.countDocuments(condition);

        const processedList = list.map(data => ({
            ...data,
            url: 'https://drive.google.com/drive/u/1/folders/' + data.url,
            ngayCapNhat: new Date(data.ngayCapNhat - 420 * 60 * 1000),
            ngayDang: functions_bt.convertDate(new Date(data.ngayDang - 420 * 60 * 1000), true)
        }));

        return res.status(200).json({
            success: true,
            message: `Danh sách tập truyện`,
            content: processedList,
            total: count
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Danh sách tập truyện",
            content: err.message
        });
    }
}

exports.xoaTapTruyen = async (req, res) => {
    try {
        const data = req.body;
        await Truyen.deleteOne({ _id: data._id });

        return res.status(200).json({
            success: true,
            message: `Xóa tập truyện`,
            content: "Xóa tập truyện thành công"
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Xóa tập truyện",
            content: err.message
        });
    }
}

exports.duyetTapTruyen = async (req, res) => {
    try {
        const data = req.body;
        const _id = data._id;
        const trangThai = Number(data.trangThai);
        const now = functions.getTimeNow();

        await Truyen.updateOne({ _id: _id }, { trangThai: trangThai, ngayDang: now });

        return res.status(200).json({
            success: true,
            message: `Duyệt tập truyện`,
            content: "Duyệt tập truyện thành công"
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Duyệt tập truyện",
            content: err.message
        });
    }
}

exports.capNhatTapTruyen = async (req, res) => {
    try {
        const now = functions.getTimeNow();
        const _idTapTruyen = req.body._id;

        if (!_idTapTruyen) {
            return res.status(400).json({
                success: false,
                message: "Cập nhật tập truyện",
                content: "Không tìm thấy id tập truyện"
            });
        }

        let data = req.body;

        data.soTrang = Number(data.soTrang) || 0;
        data.tap = Number(data.tap) || 0;
        data.soLuotTruyCap = Number(data.soLuotTruyCap) || 0;
        data.ngayDang = new Date(data.ngayDang).setMinutes(new Date(data.ngayDang).getMinutes() + 420) || now;

        await Truyen.updateOne(
            { _id: _idTapTruyen },
            {
                ...data,
                ngayCapNhat: now
            });

        return res.status(200).json({
            success: true,
            message: "Cập nhật tập truyện",
            content: "Cập nhật tập truyện thành công"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cập nhật tập truyện",
            content: error.message
        });
    }
}

exports.taiLenTapTruyenMoi = async (req, res) => {
    try {
        const data = req.body;
        const files = req.files;
        const now = functions.getTimeNow();

        if (!files) {
            return res.status(400).json({
                success: false,
                message: "Tải lên truyện",
                content: "Chưa tải lên các trang truyện"
            });
        }

        const data_bo_truyen = await Bo_truyen.findById(({ _id: data._idBoTruyen })).then(data => data);
        const ten_drive = functions.standardized(data_bo_truyen.ten);
        const check = await functions.getIdFolderDrive(ten_drive);

        if (check == "") {
            return res.status(400).json({
                success: false,
                message: "Tải lên tập truyện",
                content: "Bộ truyện chưa tồn tại vui lòng kiểm tra lại"
            });
        }
        else {
            const id_folder = check;
            const id_chap_folder = await functions.createFolder(`chap_` + data.tapSo, id_folder);

            const so_trang = files.listFile.length;

            const idTruyen = await functions.getMaxId().then(data => data.maxIdT);
            const newChapter = await Truyen.create({
                id: idTruyen + 1,
                soTrang: so_trang,
                tap: Number(data.tapSo),
                url: id_chap_folder,
                tomTat: data.tomTat,
                ngayDang: now,
                ngayCapNhat: now,
                soLuotTruyCap: 0,
                trangThai: 4,
                maBoTruyen: data_bo_truyen._id
            });

            const id_chap = newChapter._id;

            setImmediate(async () => {
                try {
                    await functions.uploadImgToDriveAndResize(files.listFile, id_chap_folder);
                    await Truyen.updateOne({ _id: id_chap }, { trangThai: 1 });
                    console.log("Tải lên drive thành công");
                    socket.emit('uploadTruyen', {
                        success: true,
                        message: `Tập ${Number(data.tapSo)} của bộ truyện "${data_bo_truyen.ten}" đã tải lên drive`
                    })
                } catch (error) {
                    socket.emit('uploadTruyen', {
                        success: false,
                        message: `Tập ${Number(data.tapSo)} của bộ truyện ${data_bo_truyen.ten} tải lên bị lỗi, vui lòng kiểm tra drive`
                    })
                    console.error('Lỗi khi upload ảnh:', error);
                }
            });

            const soTap = data_bo_truyen.soTap + 1;
            await Bo_truyen.updateOne({ _id: data._idBoTruyen }, { soTap: soTap });

            return res.status(200).json({
                success: true,
                message: `Tải lên truyện`,
                content: `Tạo tập truyện thành công đang tiến hành tải lên drive`
            });
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Tải lên truyện",
            content: err.message
        });
    }
}

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

exports.taoVoice = async (req, res) => {
    try {
        for (const field of ["ten", "noiDung", "keyVoice", "maBoTruyen"]) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `Trường '${field}' không được để trống hoặc undefined` });
            }
        }

        const data = req.body;
        const key_voice_arr = await Key_voice.find({ trangThai: 1 }, { id: 1, key: 1, _id: 0, soLuongKyTuChoPhep: 1, soLuongKyTuDaSuDung: 1 });
        const now = functions.getTimeNow();
        const url = 'https://api.fpt.ai/hmi/tts/v5';
        const speed = data?.tocDo ? Number(data.tocDo) : 1;
        const voice = 'banmai';
        const matching = key_voice_arr.find(item => item.id == Number(data.keyVoice));
        const idVoice = await functions.getMaxId().then(data => data.maxIdV);

        const data_voice = {
            id: idVoice + 1,
            ten: data.ten,
            noiDung: data.noiDung,
            trangThai: 1,
            keyVoice: Number(data.keyVoice),
            ngayTao: now,
            ngayCapNhat: now,
            maBoTruyen: data.maBoTruyen,
        };

        if (data.idTapTruyen !== null && data.idTapTruyen !== undefined) {
            data_voice.maTruyen = data.idTapTruyen
        }

        if (matching.soLuongKyTuChoPhep - matching.soLuongKyTuDaSuDung < 5000) {
            await Key_voice.updateOne({ id: id }, { trangThai: 0 })
            return res.status(400).json({
                success: false,
                message: "Tạo voice",
                content: "Key voice đã hết hạn vui lòng chọn key voice khác"
            });
        }

        if (matching.soLuongKyTuChoPhep - matching.soLuongKyTuDaSuDung - Number(data.noiDung.length) <= 5000) {
            await Key_voice.updateOne({ id: Number(data.keyVoice) }, { trangThai: 0 })
        }

        data_voice.voiceUrl = await axios.post(url, data_voice.noiDung, { headers: { 'api-key': matching.key, 'speed': speed, 'voice': voice } })
            .then(response => {
                return response.data.async;
            })
            .catch(error => {
                console.error(error);
                return 0;
            });

        await Voice.create(data_voice)
            .then(data => {
                return data
            })
            .catch(err => console.log(err))

        await Key_voice.updateOne({ id: Number(data.keyVoice) }, { soLuongKyTuDaSuDung: matching.soLuongKyTuDaSuDung + Number(data.noiDung.length) })

        return res.status(200).json({
            success: true,
            message: "Tạo voice",
            content: "Tạo voice thành công. Vui lòng đợi vài phút để có thể sử dụng voice"
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err
        });
    }
}

exports.capNhatVoice = async (req, res) => {
    try {
        for (const field of ["ten", "noiDung", "keyVoice"]) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: 'Cập nhật voice', content: `Trường '${field}' không được để trống hoặc undefined` });
            }
        }

        const data = req.body;
        const key_voice_arr = await Key_voice.find({ trangThai: 1 }, { id: 1, key: 1, _id: 0, soLuongKyTuChoPhep: 1, soLuongKyTuDaSuDung: 1 });
        const now = functions.getTimeNow();
        const url = 'https://api.fpt.ai/hmi/tts/v5';
        const speed = data?.tocDo ? Number(data.tocDo) : 1;
        const voice = 'banmai';
        const matching = key_voice_arr.find(item => item.id == Number(data.keyVoice));
        const idVoice = await functions.getMaxId().then(data => data.maxIdV);

        const data_voice = {
            ten: data.ten,
            noiDung: data.noiDung,
            trangThai: 1,
            keyVoice: Number(data.keyVoice),
            ngayCapNhat: now,
        };

        if (data.idTapTruyen !== null && data.idTapTruyen !== undefined) {
            data_voice.maTruyen = data.idTapTruyen
        }

        if (matching.soLuongKyTuChoPhep - matching.soLuongKyTuDaSuDung < 5000) {
            await Key_voice.updateOne({ id: id }, { trangThai: 0 })
            return res.status(400).json({
                success: false,
                message: "Cập nhật voice",
                content: "Key voice đã hết hạn vui lòng chọn key voice khác"
            });
        }

        if (matching.soLuongKyTuChoPhep - matching.soLuongKyTuDaSuDung - Number(data.noiDung.length) <= 5000) {
            await Key_voice.updateOne({ id: Number(data.keyVoice) }, { trangThai: 0 })
        }

        data_voice.voiceUrl = await axios.post(url, data_voice.noiDung, { headers: { 'api-key': matching.key, 'speed': speed, 'voice': voice } })
            .then(response => {
                return response.data.async;
            })
            .catch(error => {
                console.error(error);
                return 0;
            });

        await Voice.updateOne({ _id: data._id }, { ...data_voice })

        await Key_voice.updateOne({ id: Number(data.keyVoice) }, { soLuongKyTuDaSuDung: matching.soLuongKyTuDaSuDung + Number(data.noiDung.length) })

        return res.status(200).json({
            success: true,
            message: "Cập nhật voice",
            content: "Cập nhật voice thành công"
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err
        });
    }
}

exports.xoaVoice = async (req, res) => {
    try {
        const data = req.body;

        await Voice.deleteOne({ _id: data._id })

        return res.status(200).json({
            success: true,
            message: "Xóa voice",
            content: "Xóa voice thành công"
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err
        });
    }
}

exports.danhSachKeyVoice = async (req, res) => {
    try {
        const data = req.body;
        const page = Number(data.page) || 1;
        const pageSize = Number(data.pageSize) || 1000;
        const trangThai = data.trangThai;
        let condition = {};
        if (trangThai == "0" || trangThai == "1") {
            condition.trangThai = Number(trangThai);
        }

        const list_key_voice = await Key_voice.aggregate([
            { $match: condition },
            { $sort: { id: 1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    _id: 1,
                    id: 1,
                    key: 1,
                    mail: 1,
                    trangThai: 1,
                    soLuongKyTuChoPhep: 1,
                    soLuongKyTuDaSuDung: 1,
                    ngayTao: 1,
                    ngayCapNhat: 1
                }
            },
        ])

        const processedList = list_key_voice.map((item) => ({
            ...item,
            ngayTao: new Date(item.ngayTao - 420 * 60 * 1000),
            ngayCapNhat: new Date(item.ngayCapNhat - 420 * 60 * 1000),
            soLuongKyTuConLai: item.soLuongKyTuChoPhep - item.soLuongKyTuDaSuDung
        }))

        const count = await Key_voice.countDocuments(condition);

        return res.status(200).json({
            success: true,
            message: "Danh sách key voice",
            content: processedList,
            count: count
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Danh sách key voice",
            content: err.message
        });
    }
}

exports.themMoiKeyVoice = async (req, res) => {
    for (const field of ["key", "mail", "trangThai", "soLuongKyTuChoPhep", "soLuongKyTuSuDung"]) {
        if (!req.body[field]) {
            return res.status(400).json({
                success: false,
                message: "Thêm mới key voice",
                content: `Trường '${field}' không được để trống hoặc undefined`
            });
        }
    }
    try {
        const now = functions.getTimeNow();

        const data = req.body;

        const idKeyVoice = await functions.getMaxId().then(data => data.maxIdK);

        const data_key_voice =
        {
            id: idKeyVoice + 1,
            key: data.key,
            trangThai: Number(data.trangThai),
            mail: data.mail,
            soLuongKyTuChoPhep: Number(data.soLuongKyTuChoPhep) || 0,
            soLuongKyTuDaSuDung: Number(data.soLuongKyTuSuDung) || 0,
            ngayTao: now,
            ngayCapNhat: now,
        };

        await Key_voice.create(data_key_voice);

        return res.status(200).json({
            success: true,
            message: "Thêm mới key voice",
            content: "Thêm mới key voice thành công"
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Thêm mới key voice",
            content: err.message
        });
    }
}

exports.capNhatKeyVoice = async (req, res) => {
    try {
        const now = functions.getTimeNow();

        const _id = req.body._idKey;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Cập nhật key voice",
                content: "Không tìm thấy _id key voice"
            });
        }

        const data = req.body;

        await Key_voice.updateOne(
            { _id: _id },
            {
                key: data.key,
                trangThai: Number(data.trangThai),
                mail: data.mail,
                soLuongKyTuChoPhep: Number(data.soLuongKyTuChoPhep),
                soLuongKyTuDaSuDung: Number(data.soLuongKyTuSuDung),
                ngayCapNhat: now
            });

        return res.status(200).json({
            success: true,
            message: "Cập nhật key voice",
            content: "Cập nhật key voice thành công"
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cập nhật key voice",
            content: err
        });
    }
}

exports.danhSachKeyApiGoogle = async (req, res) => {
    try {
        const data = [];
        const driveConfig = functions.getConfigGroup('driveConfig');
        data.push({
            type: 'DRIVE',
            client_id: driveConfig.CLIENT_ID,
            client_secret: driveConfig.CLIENT_SECRET,
            redirect_uri: driveConfig.REDIRECT_URI,
            refresh_token: driveConfig.REFRESH_TOKEN
        })

        const mailConfig = functions.getConfigGroup('mailConfig');
        data.push({
            type: 'MAIL',
            client_id: mailConfig.CLIENT_ID,
            client_secret: mailConfig.CLIENT_SECRET,
            redirect_uri: mailConfig.REDIRECT_URI,
            refresh_token: mailConfig.REFRESH_TOKEN
        })
        const auth_email = functions.getConfigGroup('AUTH_EMAIL');

        return res.status(200).json({
            success: true,
            message: "Danh sách key api google",
            content: data,
            authEmail: auth_email
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Danh sách key api google",
            content: err.message
        });
    }
}

exports.capNhatKeyAPIGoogle = async (req, res) => {
    try {
        const data = req.body;

        for (const field of ["type", "CLIENT_ID", "CLIENT_SECRET", "REDIRECT_URI", "REFRESH_TOKEN"]) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: "Hệ thống",
                    content: `Trường '${field}' không được để trống hoặc undefined`
                });
            }
        }
        const updateConfig = {
            CLIENT_ID: data.CLIENT_ID,
            CLIENT_SECRET: data.CLIENT_SECRET,
            REDIRECT_URI: data.REDIRECT_URI,
            REFRESH_TOKEN: data.REFRESH_TOKEN
        }

        if (data.type === 'drive')
            functions.updateConfigGroup("driveConfig", updateConfig);

        if (data.type === 'mail')
            functions.updateConfigGroup("mailConfig", updateConfig);

        return res.status(200).json({
            success: true,
            message: "Danh sách key api google",
            content: "Cập nhật thành công",
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Danh sách key api google",
            content: err.message
        });
    }
}

exports.checkAPIGoogle = async (req, res) => {
    try {
        const data = req.body;
        const type = data.type;
        let content = "";
        let check = true;

        if (type === 'mail') {
            check = await functions.checkConnectionMail();
            if (check) {
                content = 'Kết nối đến Mail thành công!';
            } else {
                content = 'Kết nối đến Mail thất bại.';
            }
        }

        if (type === 'drive') {
            check = await functions.checkConnectionDrive();
            if (check) {
                content = 'Kết nối đến Google Drive thành công!';
            } else {
                content = 'Kết nối đến Google Drive thất bại.';
            }
        }

        if (check)
            return res.status(200).json({
                success: true,
                message: "Check API Google",
                content: content,
            });
        else
            return res.status(400).json({
                success: true,
                message: "Check API Google",
                content: content,
            });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Check API Google",
            content: err.message
        });
    }
}

exports.danhSachVoice = async (req, res) => {
    try {
        for (const field of ["maBoTruyen"]) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `Trường '${field}' không được để trống hoặc undefined`, content: [] });
            }
        }

        const data = req.body;
        const page = Number(data.page) || 1;
        const pageSize = Number(data.pageSize) || 10;
        const condition = {
            maBoTruyen: ObjectId(data.maBoTruyen)
        }

        const data_voice = await Voice.aggregate([
            { $match: condition },
            { $sort: { id: 1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    _id: 1,
                    id: 1,
                    ten: 1,
                    noiDung: 1,
                    trangThai: 1,
                    keyVoice: 1,
                    voiceUrl: 1,
                    ngayTao: 1,
                    ngayCapNhat: 1,
                    maBoTruyen: 1,
                    maTruyen: 1
                }
            }
        ]);

        const count = await Voice.countDocuments(condition);

        const processedList = data_voice.map(data => ({
            ...data,
            ngayTao: new Date(data.ngayTao - 420 * 60 * 1000),
            ngayCapNhat: new Date(data.ngayCapNhat - 420 * 60 * 1000)
        }));

        return res.status(200).json({
            success: true,
            message: "Danh sách voice",
            content: processedList,
            total: count
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err
        });
    }
}

exports.danhSachDeXuat = async (req, res) => {
    try {
        const data = req.body;
        const page = Number(data.page) || 1;
        const pageSize = Number(data.pageSize) || 1000;
        const _idThanhVien = data._id;
        let condition = {};
        if (_idThanhVien !== "") {
            condition.maThanhVien = ObjectId(_idThanhVien);
        }

        const list = await De_xuat.aggregate([
            { $match: condition },
            { $sort: { thoiGianDeXuat: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: "Theloai",
                    localField: "theLoai",
                    foreignField: "id",
                    as: "danhSachTheLoai"
                }
            },
            {
                $lookup: {
                    from: "Thanhvien",
                    localField: "maThanhVien",
                    foreignField: "_id",
                    as: "thongTinThanhVien"
                }
            },
            {
                $project: {
                    _id: 1,
                    ten: 1,
                    trangThai: 1,
                    tomTat: 1,
                    tacGia: 1,
                    theLoai: 1,
                    link: 1,
                    thoiGianDeXuat: 1,
                    trangBia: 1,
                    maThanhVien: 1,
                    danhSachTheLoai: {
                        $map: {
                            input: "$danhSachTheLoai",
                            as: "theloai",
                            in: "$$theloai.ten"
                        }
                    },
                    nguoiDeXuat: {
                        $arrayElemAt: ["$thongTinThanhVien.ten", 0] // Lấy `ten` từ thông tin thành viên (phần tử đầu tiên)
                    }
                }
            },
        ])

        const processedList = list.map((item) => ({
            ...item,
            thoiGianDeXuat: functions.convertDate(item.thoiGianDeXuat),
            trangBia: functions_bt.getUrlCover(item.thoiGianDeXuat, item.trangBia)
        }))

        const count = await De_xuat.countDocuments(condition);

        return res.status(200).json({
            success: true,
            message: "Danh sách đề xuất",
            content: processedList,
            count: count
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Danh sách đề xuất",
            content: err.message
        });
    }
}