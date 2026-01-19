const functions = require('../functions')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { ObjectId } = require('mongodb')
const Thanh_vien = require('../../models/Thanh_vien')

//Tải lên ảnh đại diện
exports.uploadAvatar = (file, time = null) => {
    let file_path = file.path;
    let path_file = getPathImage(time);

    let fileInfo = path.parse(file.name);

    let file_name = "";
    let file_extension = fileInfo.ext;

    if (functions.checkFile(file.name))
        file_name = functions.standardized(fileInfo.name);
    else
        return file_name;

    file_name = functions.getTimeNow() + "_" + file_name + file_extension;
    fs.rename(file_path, path_file + file_name, function (err) {
        if (err) return "";
    });
    return file_name;
}

//Tải lên ảnh đại diện nhưng đưa ảnh về kích thước 500 * 500
exports.uploadAvatarResize = async (file, time = null, width = 500, height = 500, name = null) => {
    let file_path = file.path;
    let path_file = getPathImage(time);
    let fileInfo = path.parse(file.name);
    let file_name = "";
    let file_extension = fileInfo.ext;

    if (functions.checkFile(file.name)) {
        file_name = name ? functions.standardized(name) : functions.standardized(fileInfo.name);
    }
    else
        return file_name;

    file_name = functions.getTimeNow() + "_" + file_name + file_extension;
    try {
        // Thay đổi kích thước ảnh và lưu lại với tên mới
        await sharp(file_path)
            .resize(width, height)
            .toFile(path_file + file_name);
    } catch (error) {
        console.error("Lỗi khi thay đổi kích thước hoặc lưu ảnh:", error);
        return "";
    }

    return file_name;
}

//Lấy link ảnh đại diện
exports.getUrlAvatar = (time, link) => {
    const dateTime = functions.convertDate(time, true);
    return `${process.env.BUILD_MODE === 'dev' ? process.env.IMG_LINK_DEV : process.env.IMG_LINK_PRODUCTION}/Thanh_vien/${dateTime}/${link}`
}

//Tạo đường dẫn upload ảnh
const getPathImage = (time) => {
    const dateTime = functions.convertDate(time, true);
    const path = `${process.env.IMG_PATH}/Thanh_vien/${dateTime}/`; // Tạo đường dẫn đến thư mục của người dùng

    if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
        fs.mkdirSync(path, { recursive: true });
    }
    return path;
}

//Kiểm tra sự tồn tại của tài khoản trả về:  
//0.Lỗi không xác đinh 1.Tài khoản này đã active 2.Tài khoản này đã đăng ký nhưng chưa active 3.Chưa tạo tài khoản 4.Tài khoản đã bị khóa
exports.checkTaiKhoan = async (taiKhoan) => {
    try {
        const data = await Thanh_vien.findOne({ taiKhoan: taiKhoan })
        if (data) {
            const active = data.active;
            const trangThai = data.trangThai;
            if (trangThai == 0) return { check: 4, dataTK: data }
            else if (active == 0) return { check: 2, dataTK: data }
            else return { check: 1, dataTK: data };

        } else {
            return { check: 3, dataTK: {} };
        }
    }
    catch (err) {
        console.log("Lỗi khi kiểm tra tài khoản: ", err);
        return { check: 0, dataTK: {} };
    }
}

//Hàm lấy thông tin thành viên thông qua _id khi xác thực
exports.getInfoById = async (_id) => {
    try {
        const info = await Thanh_vien.findOne({ _id: ObjectId(_id) }).then(data => data);

        if (info) {
            //Tài khoản dã bị khóa
            if (info.trangThai == 0) return "2";
            //Tài khoản chưa xác thực
            return info;
        }
        else {
            //Không tìm thấy tài khoản
            return "1"
        }
    }
    catch (err) {
        //Lỗi khi lấy thông tin thành viên
        console.log("Lỗi khi lấy thông tin thành viên");
        return "0";
    }
}

//Hàm lấy thông tin thành viên khi thành viên quên mật khẩu
exports.forgetPassword = async (taiKhoan) => {
    try {
        const info = await Thanh_vien.findOne({ taiKhoan: taiKhoan }).then(data => data);

        if (info) {
            //Tài khoản dã bị khóa
            if (info.trangThai == 0) return "2";
            //Tài khoản chưa xác thực
            return info;
        }
        else {
            //Không tìm thấy tài khoản
            return "1"
        }
    }
    catch (err) {
        //Lỗi khi lấy thông tin thành viên
        console.log("Lỗi khi lấy thông tin thành viên");
        return "0";
    }
}

//Hàm convert date về dạng yyyy-mm-dd hoặc dd-mm-yyyy
exports.convertDate = (time = null, revert = false) => {
    let date;
    if (time != null) {
        date = new Date(time);
    } else {
        date = new Date();
    }
    const y = date.getFullYear();
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    if (!revert) {
        return `${d}-${m}-${y}`;
    } else {
        return `${y}-${m}-${d}`;
    }
};