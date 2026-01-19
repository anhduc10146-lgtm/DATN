const Thanh_vien = require('../../models/Thanh_vien');
const path = require('path');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const axios = require('axios');
const socket = require('../../config/socket')
const functions_tv = require('../../services/Thanh_vien/functions');
const functions_qtv = require('../../services/Quan_tri_vien/functions');
const functions_xt = require('../../services/Xac_thuc/functions');
const functions = require('../../services/functions');
const Quan_tri_vien = require('../../models/Quan_tri_vien');
require('dotenv').config();

//Hàm đăng nhập
exports.dangNhap = async (req, res) => {
    try {
        //Lấy dữ liệu từ body
        const data = req.body;
        data.isAdmin = data.isAdmin === '1' ? true : false;

        let data_account = await functions_xt.layThongTinTaiKhoan(data);

        //Nếu tài khoản không tồn tại thì trả về thất bại luôn
        if (data_account === null) {
            return res.status(400).json({
                success: false,
                message: "Đăng nhập thất bại",
                content: "Tài khoản không tồn tại"
            });
        }

        //Tài khoản bị khóa
        if (data_account.trangThai == 0) {
            return res.status(400).json({
                success: false,
                message: "Đăng nhập thất bại",
                content: "Tài khoản đang bị khóa"
            });
        }

        //Tài khoản chưa hoàn thành đăng ký
        if (data_account.active == 0) {
            return res.status(400).json({
                success: false,
                message: "Đăng nhập thất bại",
                content: "Tài khoản chưa xác thực"
            });
        }

        let access_token;

        // Kiểm tra mật khẩu đối chiếu mật khẩu trong req và database
        if (await bcrypt.compare(data.matKhau, data_account.matKhau)) {
            //Tạo token cho người mới đăng nhập
            access_token = jwt.sign({
                taiKhoan: data_account.taiKhoan,
                _id: data_account._id
            },
                process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 * 7 }); //Thời gian sống của token là 7 ngày tính theo giây

            if (data_account.token !== "") {
                socket.emit('force-logout', { token: data_account.token })
            }

            data_account.token = access_token;

            // Thêm token cho admin hoặc user trong database
            await functions_xt.capNhatTaiKhoan(data?.isAdmin, data_account);


        }
        else {
            return res.status(400).json({
                success: false,
                message: "Đăng nhập thất bại",
                content: "Mật khẩu không chính xác"
            });
        }

        const info = Object.assign({}, {
            token: data_account.token,
            _id: data_account._id,
            anhDaiDien: data?.isAdmin ? functions_qtv.getUrlAvatar(data_account.ngayTao, data_account.anhDaiDien) : functions_tv.getUrlAvatar(data_account.ngayTao, data_account.anhDaiDien),
            ten: data_account.ten
        });
        // Nếu xác thực đăng nhập thành công, trả lại res 200 và token, thông tin dùng để đăng nhập
        res.header('Authorization', 'Bearer ' + access_token).status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            content: info
        });

    } catch (Error) {
        // Nếu ko thành công -> 400
        return res.status(500).json({
            success: false,
            message: "Đăng nhập thất bại",
            content: "Lỗi không xác định"
        });
    }
}

//Hàm đăng xuất
exports.dangXuat = async (req, res) => {
    try {
        //Lấy dữ liệu từ body và middleware
        const data = {
            isAdmin: req.body.isAdmin,
            _id: req.userId
        }
        // Lấy ra thông tin để check xem token = "" trong database hoặc có tồn tại tài khoản đăng xuất không
        let token = await functions_xt.checkToken(data);

        if (token == "0" || token == "") {
            // Nếu thành công trả lại res 200
            return res.status(400).json({
                success: true,
                message: "Đăng xuất thất bại",
                content: `Không tìm thấy tài khoản ${data?.isAdmin ? "quản trị viên" : "thành viên"} cần đăng xuất`
            });
        }

        //Xóa token và thông báo đăng xuất thành công
        await functions_xt.xoaToken(data);

        // Nếu thành công trả lại res 200
        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công",
            content: `Đăng xuất tài khoản ${data?.isAdmin ? "quản trị viên" : "thành viên"} thành công`
        });
    }

    catch (Error) {
        // Nếu ko thành công trả lại 400
        return res.status(500).json({
            success: false,
            message: "Đăng xuất thất bại",
            content: Error
        });
    }
}

//Hàm đăng ký
exports.dangKy = async (req, res) => {
    try {
        //Lấy dữ liệu từ body
        const data = req.body;
        const files = req.files;
        const now = functions.getTimeNow();

        for (const field of ["taiKhoan", "matKhau", "ten", "soDienThoai", "ngaySinh", "gioiTinh"]) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `Trường '${field}' không được để trống hoặc undefined`
                });
            }
        }

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Trường anhDaiDien không được bỏ trống!",
            });
        }

        const { check, dataTK } = await functions_tv.checkTaiKhoan(data.taiKhoan);

        //Lỗi khi kiểm tra tài khoản
        if (check == 0) {
            return res.status(400).json({
                success: false,
                message: "Đăng ký thất bại",
                content: "Lỗi khi kiểm tra tài khoản trùng"
            });
        }

        // Tài khoản đã tồn tại
        if (check == 1) {
            return res.status(400).json({
                success: false,
                message: "Đăng ký thất bại",
                content: `Tài khoản đã tồn tại`
            });
        }

        //Tài khoản đã tạo nhưng chưa xác thực
        if (check == 2) {
            const token = jwt.sign({
                taiKhoan: dataTK.taiKhoan,
                ten: dataTK.ten,
                _id: dataTK._id,
                status: 0,
                ngayTao: now,
                ngayHetHan: now + 1000 * 60 * 6
            },
                process.env.TOKEN_SECRET, { expiresIn: 60 * 6 });

            //Gửi mail xác thực tài khoản
            const to = dataTK.email;
            const subject = "Xác thực tài khoản";
            const text = '';
            const html = `
            <p>Vui lòng xác thực địa chỉ mail để hoàn thành bước đăng ký tài khoản tại <span style="color: blue; font-size: 1.2em; font-weight: bold;">Web truyện 2601</span></p>
            <p>Link dưới đây có hiệu lực trong vòng 5p kể từ lúc nhận được mail</p>
            <p>Nhấn vào <a href=${(process.env.BUILD_MODE_FE === 'dev' ? process.env.REACT_APP_FE_LOCAL : process.env.REACT_APP_FE_LIVE) + '/user/verify/' + dataTK._id + '/' + token}>đây</a> để xác thực mail</p>
            <p>${now}</p>
            `
            await functions.sendMail(to, subject, text, html);

            return res.status(400).json({
                success: false,
                message: "Đăng ký thất bại",
                content: `Tài khoản đã được tạo dưới tên ${dataTK.ten} nhưng chưa xác thực. Vui lòng kiểm tra lại gmail của bạn`
            });
        }

        //Tạo tài khoản thành công
        if (check == 3) {
            const anhDaiDien = await functions_tv.uploadAvatarResize(files.anhDaiDien, now, 500, 500, data.ten);

            if (anhDaiDien == "") {
                return res.status(400).json({
                    success: false,
                    message: `Tạo tài khoản thất bại`,
                    content: "Tải ảnh lên bị lỗi."
                });
            }

            const data_thanh_vien = {
                ten: data.ten,
                anhDaiDien: anhDaiDien,
                ngaySinh: new Date(data.ngaySinh),
                diaChi: data.diaChi || "",
                gioiTinh: parseInt(data.gioiTinh, 10),
                trangThai: 1,
                active: 0,
                taiKhoan: data.taiKhoan,
                matKhau: await bcrypt.hash(data.matKhau, 10),
                token: "",
                refresh_token: "",
                email: data.taiKhoan,
                soDienThoai: data.soDienThoai,
                soDuTaiKhoan: 0,
                theLoaiYeuThich: [],
                ngayTao: now,
                ngayCapNhat: now
            }

            let _id_thanh_vien = await Thanh_vien.create({ ...data_thanh_vien })
                .then(data => data._id)
                .catch(err => "")

            if (_id_thanh_vien == "") {
                return res.status(400).json({
                    success: false,
                    message: `Tạo tài khoản thất bại`,
                    content: "Lỗi khi tạo tài khoản trong CSDL."
                });
            }

            //Gửi mail xác nhận tài khoản
            const token = jwt.sign({
                taiKhoan: data.taiKhoan,
                ten: data.ten,
                _id: _id_thanh_vien,
                status: 1,
                ngayTao: now,
                ngayHetHan: now + 1000 * 60 * 6
            },
                process.env.TOKEN_SECRET, { expiresIn: 60 * 6 });

            //Gửi mail xác thực tài khoản
            const to = data.taiKhoan;
            const subject = "Xác thực tài khoản";
            const text = '';
            const html = `
            <p>Vui lòng xác thực địa chỉ mail để hoàn thành bước đăng ký tài khoản tại <span style="font-size: 1.2em;">Web truyện 2601</span></p>
            <p>Link dưới đây có hiệu lực trong vòng 5p kể từ lúc nhận được mail</p>
            <p>Nhấn vào <a href=${(process.env.BUILD_MODE_FE === 'dev' ? process.env.REACT_APP_FE_LOCAL : process.env.REACT_APP_FE_LIVE) + '/user/verify/' + _id_thanh_vien + '/' + token}>đây</a> để xác thực mail</p>
            <p>${now}</p>
            `
            await functions.sendMail(to, subject, text, html);

            return res.status(200).json({
                success: true,
                message: `Tạo tài khoản thành công`,
                content: "Vui lòng truy cập mail để xác thực tài khoản"
            });
        }

        // Tài khoản đã bị khóa
        if (check == 4) {
            return res.status(400).json({
                success: false,
                message: `Tạo tài khoản thất bại`,
                content: "Tài khoản này đang bị khóa, vui lòng liên hệ quản trị viên."
            });
        }
    }

    catch (Error) {
        // Nếu ko thành công trả lại 500
        return res.status(500).json({
            success: false,
            message: "Đăng ký thất bại",
            content: Error
        });
    }
}

//Hàm giải mã token xác thực
exports.xacThucToken = async (req, res) => {
    try {
        const data = req.body;
        //Xác thực tài khoản cho thành viên
        let check = await functions_tv.getInfoById(data._id);

        //Xác thực tài khoản cho quản trị viên
        const data_qtv = await Quan_tri_vien.findById({ _id: ObjectId(data._id) }).then(data => data);

        if (data_qtv) {
            check = data_qtv;
        }

        if (["0", "1", "2"].includes(check)) {
            const content = ["Lỗi khi lấy thông tin người dùng", "Không tìm thấy tài khoản", "Tài khoản dã bị khóa"]
            return res.status(400).json({
                success: false,
                message: "Xác thực thất bại",
                content: content[parseInt(check)]
            });
        }

        jwt.verify(data.token, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Xác thực thất bại",
                    content: "Token này đã bị hết hạn"
                });
            }

            //Lấy lại mật khẩu hoặc đăng ký nhưng chưa xác thực
            if (decoded.status == 0) {
                await Thanh_vien.updateOne({ _id: data._id }, { active: 1 });
                //Lấy lại mật khẩu
                if (check.active == 1 || check.active == 2) {
                    return res.status(200).json({
                        success: true,
                        message: `Xác thực tài khoản thành công`,
                        content: {
                            status: decoded.status,
                            ten: decoded.ten,
                            message: "Hãy tiến hành nhập lại mật khẩu trong vòng 5 phút"
                        }
                    });
                }
                //Đăng ký nhưng chưa xác thực
                else {
                    return res.status(200).json({
                        success: true,
                        message: `Xác thực tài khoản thành công`,
                        content: {
                            status: decoded.status,
                            ten: decoded.ten,
                            message: "Bạn đã hoàn thành đăng ký tài khoản\n Bạn có thể nhập lại mật khẩu trong vòng 5 phút nữa nếu muốn"
                        }
                    });
                }
            }
            //Xác thực ngay sau đăng ký
            else if (decoded.status == 1) {
                await Thanh_vien.updateOne({ _id: data._id }, { active: 1 });
                return res.status(200).json({
                    success: true,
                    message: `Xác thực tài khoản thành công`,
                    content: {
                        status: decoded.status,
                        ten: decoded.ten,
                        message: "Bạn đã hoàn thành đăng ký tài khoản"
                    }
                })
            }
            //Lấy lại mật khẩu cho quản trị viên
            else if (decoded.status == 2) {
                return res.status(200).json({
                    success: true,
                    message: `Xác thực tài khoản thành công`,
                    content: {
                        status: decoded.status,
                        ten: decoded.ten,
                        message: "Hãy tiến hành nhập lại mật khẩu trong vòng 5 phút"
                    }
                });
            }
            //Trạng thái chưa xác định có thể bổ sung sau này nếu thiếu
            else {
                return res.status(400).json({
                    success: true,
                    message: `Xác thực tài khoản thất bại`,
                    content: "Không xác định được trạng thái token"
                })
            }
        });
    }
    catch (err) {
        console.log(err);
        // Nếu ko thành công trả lại 500
        return res.status(500).json({
            success: false,
            message: "Xác thực thất bại",
            content: "Lỗi không xác định"
        });
    }
}

//Hàm gửi yêu cầu quên mật khẩu
exports.quenMatKhau = async (req, res) => {
    try {
        const data = req.body;
        const now = functions.getTimeNow();
        let token = '';
        //Gửi yêu cầu quên mật khẩu với quản trị viên
        if (data.taiKhoan === 'hoang12b1ksa@gmail.com') {
            const data_qtv = await Quan_tri_vien.findOne({ taiKhoan: data.taiKhoan }).then(data => data);

            token = jwt.sign({
                taiKhoan: data_qtv.taiKhoan,
                ten: data_qtv.ten,
                _id: data_qtv._id,
                status: 2,
                ngayTao: now,
                ngayHetHan: now + 1000 * 60 * 6
            },
                process.env.TOKEN_SECRET, { expiresIn: 60 * 6 });

            //Gửi mail xác thực tài khoản
            const to = data.taiKhoan;
            const subject = "Xác thực tài khoản";
            const text = '';
            const html = `
            <p>Vui lòng xác thực địa chỉ mail để lấy lại mật khẩu tại <span style="font-size: 1.2em;">Web truyện 2601</span></p>
            <p>Link dưới đây có hiệu lực trong vòng 5p kể từ lúc nhận được mail</p>
            <p>Nhấn vào <a href=${(process.env.BUILD_MODE_FE === 'dev' ? process.env.REACT_APP_FE_LOCAL : process.env.REACT_APP_FE_LIVE) + '/user/verify/' + data_qtv._id + '/' + token}>đây</a> để xác thực mail</p>
            <p>${now}</p>
            `
            await functions.sendMail(to, subject, text, html);

            return res.status(200).json({
                success: true,
                message: `Quên mật khẩu`,
                content: "Vui lòng truy cập mail để xác thực tài khoản trước khi đổi mật khẩu"
            });
        }

        //Gửi yêu cầu quên mật khẩu với thành viên
        const check = await functions_tv.forgetPassword(data.taiKhoan);

        if (["0", "1", "2"].includes(check)) {
            const content = ["Lỗi khi lấy thông tin tài khoản", "Không tìm thấy tài khoản", "Tài khoản dã bị khóa"]
            return res.status(400).json({
                success: false,
                message: "Quên mật khẩu",
                content: content[parseInt(check)]
            });
        }

        //Gửi mail xác nhận tài khoản
        token = jwt.sign({
            taiKhoan: check.taiKhoan,
            ten: check.ten,
            _id: check._id,
            status: 0,
            ngayTao: now,
            ngayHetHan: now + 1000 * 60 * 6
        },
            process.env.TOKEN_SECRET, { expiresIn: 60 * 6 });

        //Gửi mail xác thực tài khoản
        const to = data.taiKhoan;
        const subject = "Xác thực tài khoản";
        const text = '';
        const html = `
        <p>Vui lòng xác thực địa chỉ mail để lấy lại mật khẩu tại <span style="font-size: 1.2em;">Web truyện 2601</span></p>
        <p>Link dưới đây có hiệu lực trong vòng 5p kể từ lúc nhận được mail</p>
        <p>Nhấn vào <a href=${(process.env.BUILD_MODE_FE === 'dev' ? process.env.REACT_APP_FE_LOCAL : process.env.REACT_APP_FE_LIVE) + '/user/verify/' + check._id + '/' + token}>đây</a> để xác thực mail</p>
        <p>${now}</p>
        `
        await functions.sendMail(to, subject, text, html);

        return res.status(200).json({
            success: true,
            message: `Quên mật khẩu`,
            content: "Vui lòng truy cập mail để xác thực tài khoản trước khi đổi mật khẩu"
        });
    }
    catch (err) {
        console.log(err);
        // Nếu ko thành công trả lại 500
        return res.status(500).json({
            success: false,
            message: "Quên mật khẩu",
            content: "Lỗi không xác định"
        });
    }
}

//Hàm cập nhật mật khẩu mới
exports.layLaiMatKhau = async (req, res) => {
    try {
        const data = req.body;
        const now = functions.getTimeNow();

        //Xác thực tài khoản cho thành viên
        let check = await functions_tv.getInfoById(data._id);

        //Xác thực tài khoản cho quản trị viên
        const data_qtv = await Quan_tri_vien.findById({ _id: ObjectId(data._id) }).then(data => data);

        if (data_qtv) {
            check = data_qtv;
        }

        if (["0", "1", "2"].includes(check)) {
            const content = ["Lỗi khi lấy thông tin người dùng", "Không tìm thấy tài khoản", "Tài khoản dã bị khóa"]
            return res.status(400).json({
                success: false,
                message: "Xác thực thất bại",
                content: content[parseInt(check)]
            });
        }

        jwt.verify(data.token, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Đổi mật khẩu thất bại",
                    content: "Token đã hết hạn"
                });
            }
            //Lấy lại mật khẩu hoặc lấy lại mật khẩu sau khi đăng ký nhưng chưa xác thực
            if (decoded.status == 0) {
                //30p mới được đổi mật khẩu 1 lần
                if (now - check.ngayCapNhat < (30 * 60 * 1000)) {
                    const minute = Math.ceil((now - check.ngayCapNhat) / (60 * 1000));
                    return res.status(400).json({
                        success: true,
                        message: `Đổi mật khẩu thất bại`,
                        content: `Vui lòng đổi mật khẩu sau ${30 - minute} phút nữa`
                    });
                }

                await Thanh_vien.updateOne(
                    { _id: data._id },
                    {
                        matKhau: await bcrypt.hash(data.matKhau, 10),
                        ngayCapNhat: now
                    })

                return res.status(200).json({
                    success: true,
                    message: `Đổi mật khẩu thành công`,
                    content: {
                        status: decoded.status,
                        ten: decoded.ten,
                        message: "Bạn đã có thể đăng nhập"
                    }
                });

            }
            //Nếu vừa đăng ký xong thì phải đợi 30p sau mới đổi được mật khẩu
            else if (decoded.status == 1) {
                return res.status(400).json({
                    success: true,
                    message: `Thay đổi mật khẩu thất bại`,
                    content: "Vui lòng đợi 30p sau mới được đổi mật khẩu"
                })
            }
            //Quản trị viên lấy lại mật khẩu
            else if (decoded.status == 2) {
                //30p mới được đổi mật khẩu 1 lần
                if (now - check.ngayCapNhat < (30 * 60 * 1000)) {
                    const minute = Math.ceil((now - check.ngayCapNhat) / (60 * 1000));
                    return res.status(400).json({
                        success: true,
                        message: `Đổi mật khẩu thất bại`,
                        content: `Vui lòng đổi mật khẩu sau ${30 - minute} phút nữa`
                    });
                }

                await Quan_tri_vien.updateOne(
                    { _id: data._id },
                    {
                        matKhau: await bcrypt.hash(data.matKhau, 10),
                        ngayCapNhat: now
                    })

                return res.status(200).json({
                    success: true,
                    message: `Đổi mật khẩu thành công`,
                    content: {
                        status: decoded.status,
                        ten: decoded.ten,
                        message: "Bạn đã có thể đăng nhập"
                    }
                });

            }
            //Trạng thái chưa xác định có thể bổ sung sau này nếu thiếu
            else {
                return res.status(400).json({
                    success: true,
                    message: `Thay đổi mật khẩu thất bại`,
                    content: "Không xác định được trạng thái token"
                })
            }
        });
    }
    catch (err) {
        console.log(err);
        // Nếu ko thành công trả lại 500
        return res.status(500).json({
            success: false,
            message: "Thay đổi mật khẩu thất bại",
            content: "Lỗi không xác định"
        });
    }
}