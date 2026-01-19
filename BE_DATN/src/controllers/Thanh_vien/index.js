const Thanh_vien = require('../../models/Thanh_vien');
const Hoa_don = require('../../models/Hoa_don');
const De_xuat = require('../../models/De_xuat');
const Thong_bao = require('../../models/Thong_bao');
const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const socket = require('../../config/socket')
const functions_tv = require('../../services/Thanh_vien/functions');
const functions_xt = require('../../services/Xac_thuc/functions');
const functions_bt = require('../../services/Bo_truyen/functions');
const functions = require('../../services/functions');
require('dotenv').config();

exports.thongTinTaiKhoan = async (req, res) => {
    try {
        const _id = req.userId;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id người dùng"
            });
        }

        const data = await Thanh_vien.findById({ _id: _id }).then(data => data);

        return res.status(200).json({
            success: true,
            message: "Thông tin tài khoản",
            content: {
                _id: data._id,
                taiKhoan: data.taiKhoan,
                ten: data.ten,
                soDienThoai: data.soDienThoai,
                email: data.email,
                soDuTaiKhoan: data.soDuTaiKhoan,
                ngaySinh: functions_tv.convertDate(data.ngaySinh, true),
                diaChi: data.diaChi,
                gioiTinh: data.gioiTinh,
                ngayTao: data.ngayTao,
                ngayCapNhat: data.ngayCapNhat,
                active: data.active
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

exports.capNhatThongTinCaNhan = async (req, res) => {
    try {
        const _id = req.userId;
        const now = functions.getTimeNow();
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id người dùng"
            });
        }

        let data = req.body;
        const files = req.files;

        if (data.ngaySinh) {
            data.ngaySinh = new Date(data.ngaySinh);
        }

        let info = await Thanh_vien.findById({ _id: _id }).then(data => data);

        if (files && Object.keys(files).length > 0) {
            const anhDaiDien = await functions_tv.uploadAvatarResize(files.anhDaiDien, info.ngayTao, 500, 500, info.ten);
            data.anhDaiDien = anhDaiDien;
        }

        await Thanh_vien.updateOne({ _id: _id }, { ...data, ngayCapNhat: now })

        info = await Thanh_vien.findById({ _id: _id }).then(data => data);

        return res.status(200).json({
            success: true,
            message: "Thông tin tài khoản",
            content: {
                ten: info.ten,
                anhDaiDien: functions_tv.getUrlAvatar(info.ngayTao, info.anhDaiDien)
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
        const _id = req.userId;
        const now = functions.getTimeNow();
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id người dùng"
            });
        }

        const data = req.body;

        let info = await Thanh_vien.findById({ _id: _id }).then(data => data);

        // Kiểm tra mật khẩu đối chiếu mật khẩu trong req và database
        if (await bcrypt.compare(data.matKhauCu, info.matKhau)) {
            await Thanh_vien.updateOne({ _id: _id }, { matKhau: await bcrypt.hash(data.matKhauMoi, 10) });
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

exports.napTienVaoTaiKhoan = async (req, res) => {
    try {
        const _id = req.userId;
        const token = req.get('Authorization') ? req.get('Authorization').split(' ')[1] : '';
        const now = functions.getTimeNow();
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id người dùng"
            });
        }

        const data_member = await Thanh_vien.findById({ _id: _id }).then(data => data);
        const data = req.body;
        const content = String(now);
        const soTien = Number(data.soTien);

        //Tạo hóa đơn với trạng thái đang xử lý
        const idMaxHoaDon = (await Hoa_don.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;
        const data_hoa_don = {
            id: idMaxHoaDon + 1,
            tongSoTien: soTien,
            ngayTao: now,
            ngayDuyetDon: now,
            hanhDong: 0,
            trangThai: 1,
            maThanhVien: _id
        }
        const _idHoaDon = await Hoa_don.create(data_hoa_don).then(data => data._id);

        const idMaxThongBao = (await Thong_bao.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;

        const data_thong_bao = {
            ten: "Nạp tiền",
            id: idMaxThongBao + 1,
            noiDung: `Thành viên ${data_member.ten} vừa tạo yêu cầu nạp ${soTien} VNĐ`,
            ngayTao: now,
            trangThai: 0,
            loai: 0,
            maThanhVien: _id,
            maHoaDon: _idHoaDon,
        };

        await Thong_bao.create(data_thong_bao);

        // Chạy kiểm tra trong nền
        (async function monitorPayment(hoaDonId, soTien, content, _id) {
            const intervalTime = 1000;
            const timeoutTime = 300000;
            const startTime = functions.getTimeNow();

            async function checkAndUpdate() {
                try {
                    const check = await functions.checkPaid(soTien, content);

                    if (check) {
                        await Hoa_don.updateOne(
                            { _id: hoaDonId },
                            { $set: { trangThai: 3 } }
                        );
                        await Thanh_vien.updateOne(
                            { _id: _id },
                            { $inc: { soDuTaiKhoan: Number(soTien) || 0 } }
                        )
                        socket.emit('thanh-toan', {
                            success: true,
                            token: token,
                            content: `Bạn vừa nạp thành công ${soTien} VNĐ vào tài khoản`
                        })
                        return; // Kết thúc vòng lặp
                    }

                    if (functions.getTimeNow() - startTime >= timeoutTime) {
                        await Hoa_don.updateOne(
                            { _id: hoaDonId },
                            { $set: { trangThai: 4, ngayDuyetDon: functions.getTimeNow() } }
                        );
                        socket.emit('thanh-toan', {
                            success: false,
                            token: token,
                            content: `Giao dịch gần nhất đã bị hủy do quá thời gian thanh toán`
                        })
                        return; // Kết thúc vòng lặp
                    }

                    // Tiếp tục kiểm tra sau 1 giây
                    setTimeout(() => {
                        setImmediate(checkAndUpdate);
                    }, intervalTime);
                } catch (error) {
                    console.error("Lỗi trong quá trình kiểm tra thanh toán:", error.message);
                    await Hoa_don.updateOne(
                        { _id: hoaDonId },
                        { $set: { trangThai: 2, ngayDuyetDon: functions.getTimeNow() } }
                    );
                    socket.emit('thanh-toan', {
                        success: false,
                        token: token,
                        content: `Giao dịch bị lỗi do hệ thống, vui lòng liên hệ quản trị viên`
                    })
                }
            }

            setImmediate(checkAndUpdate); // Bắt đầu vòng lặp
        })(_idHoaDon, soTien, content, _id);

        return res.status(200).json({
            success: true,
            message: "Nạp tiền vào tài khoản",
            content: "Vui lòng quét mã QR và kiểm tra phần lịch sử nạp tiền",
            noiDungChuyenKhoan: now
        });
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Nạp tiền vào tài khoản",
            content: error.message
        });
    }
}

exports.danhSachHoaDon = async (req, res) => {
    try {
        const _id = req.userId;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id người dùng"
            });
        }

        const data = req.body;
        const ngayTao = data.ngayTao;
        const trangThai = data.trangThai;
        const hanhDong = data.hanhDong;
        const page = Number(data.page) || 1;
        const pageSize = Number(data.pageSize) || 10;

        const condition = {};

        condition.maThanhVien = ObjectId(_id);

        if (trangThai) {
            condition.trangThai = Number(trangThai);
        }

        if (hanhDong) {
            condition.hanhDong = Number(hanhDong);
        }

        if (ngayTao) {
            const startOfDay = new Date(`${ngayTao}T00:00:00`).getTime() + 420 * 60 * 1000;
            const endOfDay = new Date(`${ngayTao}T23:59:59`).getTime() + 420 * 60 * 1000;

            if (!isNaN(startOfDay) && !isNaN(endOfDay)) {
                condition.ngayTao = { $gte: startOfDay, $lte: endOfDay };
            }
        }

        const list = await Hoa_don.aggregate([
            { $match: condition },
            { $sort: { ngayTao: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            { $sort: { ngayTao: 1 } },
            {
                $project: {
                    _id: 1,
                    id: 1,
                    tongSoTien: 1,
                    ngayTao: 1,
                    hanhDong: 1,
                    trangThai: 1
                }
            }])

        const updatedList = list.map(item => ({
            ...item,
            noiDungChuyenKhoan: item.ngayTao,
            ngayTao: functions.convertDate(item.ngayTao),
        }));

        const count = await Hoa_don.countDocuments(condition);

        return res.status(200).json({
            success: true,
            message: "Danh sách hóa đơn",
            content: updatedList,
            total: count
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Danh sách hóa đơn",
            content: error.message
        });
    }
}

exports.nangCapTaiKhoan = async (req, res) => {
    try {
        const _id = req.userId;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id người dùng"
            });
        }
        const now = functions.getTimeNow();

        const data_tv = await Thanh_vien.findById({ _id: _id }).then(data => data);
        if (data_tv.active === 2) {
            if (data_tv.ngayHetHanVip1 > now)
                return res.status(400).json({
                    success: true,
                    message: "Nâng cấp tài khoản",
                    content: "Bạn đang sở hữu gói vip này, chỉ có thể gia hạn gói vip",
                });
        }

        if (data_tv.soDuTaiKhoan < 25000) {
            if (data_tv.active === 2 && data_tv.ngayHetHanVip1 < now)
                await Thanh_vien.updateOne({ _id: _id }, { active: 1 })

            return res.status(400).json({
                success: true,
                message: "Nâng cấp tài khoản",
                content: "Số dư tài khoản của bạn không đủ để nâng cấp gói vip này",
            });
        }
        //Cập nhật loại thành viên
        await Thanh_vien.updateOne({ _id: _id }, { active: 2, soDuTaiKhoan: data_tv.soDuTaiKhoan - 25000, ngayHetHanVip1: now + 30 * 24 * 60 * 60 * 1000 })

        //Tạo hóa đơn với trạng thái thành công
        const idMaxHoaDon = (await Hoa_don.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;
        const data_hoa_don = {
            id: idMaxHoaDon + 1,
            tongSoTien: 25000,
            ngayTao: now,
            ngayDuyetDon: now,
            hanhDong: 1,
            trangThai: 3,
            maThanhVien: _id
        }
        const _idHoaDon = await Hoa_don.create(data_hoa_don).then(data => data._id);

        const idMaxThongBao = (await Thong_bao.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;

        const data_thong_bao = {
            ten: "Nâng cấp tài khoản",
            id: idMaxThongBao + 1,
            noiDung: `Thành viên ${data_tv.ten} nâng cấp thành viên lên vip 1`,
            ngayTao: now,
            trangThai: 0,
            loai: 2,
            maThanhVien: _id,
            maHoaDon: _idHoaDon,
        };

        await Thong_bao.create(data_thong_bao);

        socket.emit('nang-cap-thanh-vien', {
            success: true,
            content: `Thành viên ${data_tv.ten} nâng cấp thành viên lên vip 1`
        })

        return res.status(200).json({
            success: true,
            message: "Nâng cấp tài khoản",
            content: "Chúc mừng bạn đã trở thành Thành viên vip",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Nâng cấp tài khoản",
            content: error.message
        });
    }
}

exports.danhSachGoiSoHuu = async (req, res) => {
    try {
        const _id = req.userId;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id người dùng"
            });
        }
        const danhSachGoiSoHuu = [];

        const data_tv = await Thanh_vien.findById({ _id: _id }).then(data => data);

        if (data_tv.active === 2) {
            const ngayHetHan = functions_tv.convertDate(data_tv.ngayHetHanVip1).replaceAll("-", "/");
            danhSachGoiSoHuu.push({ goi: 'Thành viên vip', loai: 'VIP 1', ngayHetHan: ngayHetHan })
        }

        return res.status(200).json({
            success: true,
            message: "Danh sách gói sở hữu",
            content: danhSachGoiSoHuu,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Danh sách gói sở hữu",
            content: error.message
        });
    }
}

exports.giaHanGoi = async (req, res) => {
    try {
        const _id = req.userId;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id người dùng"
            });
        }
        const now = functions.getTimeNow();
        const data = req.body;
        const soThang = Number(data.soThang);
        const tien = [
            25000,
            45000,
            65000,
            85000,
            105000,
            125000,
            145000,
            165000,
            185000,
            205000,
            225000,
            245000
        ];

        const data_tv = await Thanh_vien.findById({ _id: _id }).then(data => data);

        if (data_tv.soDuTaiKhoan < tien[soThang - 1]) {
            return res.status(400).json({
                success: true,
                message: "Gia hạn gói",
                content: "Số dư tài khoản của bạn không đủ để nâng cấp gói vip này",
            });
        }

        const ngayHetHanVip1 = data_tv.ngayHetHanVip1 < now ? now : data_tv.ngayHetHanVip1;
        //Cập nhật loại thành viên
        await Thanh_vien.updateOne({ _id: _id }, { active: 2, soDuTaiKhoan: data_tv.soDuTaiKhoan - tien[soThang - 1], ngayHetHanVip1: ngayHetHanVip1 + soThang * 30 * 24 * 60 * 60 * 1000 })

        //Tạo hóa đơn với trạng thái thành công
        const idMaxHoaDon = (await Hoa_don.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;
        const data_hoa_don = {
            id: idMaxHoaDon + 1,
            tongSoTien: tien[soThang],
            ngayTao: now,
            ngayDuyetDon: now,
            hanhDong: 2,
            trangThai: 3,
            maThanhVien: _id
        }
        const _idHoaDon = await Hoa_don.create(data_hoa_don).then(data => data._id);

        const idMaxThongBao = (await Thong_bao.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;

        const data_thong_bao = {
            ten: "Gia hạn gói",
            id: idMaxThongBao + 1,
            noiDung: `Thành viên ${data_tv.ten} gia hạn gói vip 1`,
            ngayTao: now,
            trangThai: 0,
            loai: 3,
            maThanhVien: _id,
            maHoaDon: _idHoaDon,
        };

        await Thong_bao.create(data_thong_bao);

        socket.emit('gia-han-goi', {
            success: true,
            content: `Thành viên ${data_tv.ten} gia hạn gói vip 1`
        })

        return res.status(200).json({
            success: true,
            message: "Gia hạn gói",
            content: "Chúc mừng bạn gia hạn gói vip thành công",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gia hạn gói",
            content: error.message
        });
    }
}

exports.deXuatTruyen = async (req, res) => {
    try {
        const _id = req.userId;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin tài khoản",
                content: "Không tìm thấy id người dùng"
            });
        }
        const data_tv = await Thanh_vien.findById({ _id: _id }).then(data => data);

        // Kiểm tra các trường trong req.body
        for (const field of ["ten", "tomTat", "theLoai", "link", "tacGia"]) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `Trường '${field}' không được để trống hoặc undefined` });
            }
        }

        // Kiểm tra các trường trong req.files
        for (const fileField of ["trangBia"]) {
            if (!req.files || !req.files[fileField]) {
                return res.status(400).json({ success: false, message: `File '${fileField}' không được để trống hoặc undefined` });
            }
        }

        const now = functions.getTimeNow();
        const data = req.body;
        const ten = data.ten;
        const tacGia = data.tacGia;
        const the_loai = data.theLoai.map((item) => Number(item));
        const link = data.link;
        const tomTat = data.tomTat;
        const data_file = req.files;
        const trang_bia = await functions_bt.uploadCoverResize(data_file.trangBia, now);

        const new_de_xuat = await De_xuat.create({
            ten: ten,
            trangThai: 0,
            tomTat: tomTat,
            tacGia: tacGia,
            theLoai: the_loai,
            link: link,
            thoiGianDeXuat: now,
            maThanhVien: _id,
            trangBia: trang_bia
        })
            .then(data => data)
            .catch(error => {
                console.error("Lỗi khi tạo bộ truyện:", error);
                throw error;
            });

        const idMaxThongBao = (await Thong_bao.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;

        const data_thong_bao = {
            ten: "Đề xuất truyện",
            id: idMaxThongBao + 1,
            noiDung: `Thành viên ${data_tv.ten} vừa đề xuất 1 truyện mới`,
            ngayTao: now,
            trangThai: 0,
            loai: 1,
            maThanhVien: _id,
            maDeXuat: new_de_xuat._id,
        };

        await Thong_bao.create(data_thong_bao);

        socket.emit('de-xuat-truyen', {
            success: true,
            content: `Thành viên ${data_tv.ten} vừa đề xuất 1 truyện mới`
        })

        return res.status(200).json({
            success: true,
            message: "Đề xuất truyện",
            content: "Đề xuất truyện thành công",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Đề xuất truyện",
            content: error.message
        });
    }
}