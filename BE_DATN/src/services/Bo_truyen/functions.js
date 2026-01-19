const functions = require('../functions')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

//Tải lên trang bìa
exports.uploadCover = (file, time = null) => {
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

//Tải lên trang bìa nhưng resize về 442 * 648
exports.uploadCoverResize = async (file, time = null, width = 442, height = 648) => {
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

//Lấy link ảnh bìa
exports.getUrlCover = (time, link) => {
    const dateTime = functions.convertDate(time, true);
    return `${process.env.BUILD_MODE === 'dev' ? process.env.IMG_LINK_DEV : process.env.IMG_LINK_PRODUCTION}/Bo_truyen/${dateTime}/${link}`
}

//Tạo đường dẫn upload ảnh
const getPathImage = (time) => {
    const dateTime = functions.convertDate(time, true);
    const path = `${process.env.IMG_PATH}/Bo_truyen/${dateTime}/`; // Tạo đường dẫn đến thư mục của người dùng

    if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
        fs.mkdirSync(path, { recursive: true });
    }
    return path;
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