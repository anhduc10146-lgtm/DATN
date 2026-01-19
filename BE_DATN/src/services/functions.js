const The_loai = require('../models/The_loai');
const Voice = require('../models/Voice');
const Quan_tri_vien = require('../models/Quan_tri_vien');
const Truyen = require('../models/Truyen');
const Key_voice = require('../models/Key_voice');
const functions_drive = require('./Api_google/Drive/functions');
const functions_mail = require('./Api_google/Mail/functions')
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { PassThrough } = require('stream');
const sharp = require('sharp');
const axios = require('axios');


// Đường dẫn file config.json
const CONFIG_FILE = path.join(__dirname, '../config/config.json');

//Khởi tạo config
exports.initConfig = (config) => {
    try {
        // Ghi đè toàn bộ file bằng dữ liệu config truyền vào
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    } catch (error) {
        console.error('Lỗi xảy ra khi ghi đè file:', error.message);
    }
}

//Lấy toàn bộ dữ liệu trong file config.json
exports.getAllConfig = () => {
    try {
        const fileContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('File chưa có group config nào');
        return null;
    }
};

// Hàm lấy một nhóm config từ file
exports.getConfigGroup = (group) => {
    try {
        const config = this.getAllConfig(CONFIG_FILE);
        if (config[group]) {
            return config[group];
        }
    } catch (error) {
        console.error('Lỗi khi lấy config:', error.message);
        return null;
    }
};

// Hàm cập nhật một nhóm config
exports.updateConfigGroup = (group, newConfig) => {
    const config = this.getAllConfig(CONFIG_FILE);
    if (config[group]) {
        config[group] = { ...config[group], ...newConfig };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    } else {
        console.error('Không tồn tại group', group);
        return null;
    }
};

// Hàm xóa một nhóm config
exports.deleteConfigGroup = (group) => {
    if (config[group]) {
        delete config[group];
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    } else {
        console.error('Không tồn tại group ', group);
        return null;
    }
};

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = functions_drive.createConfigDrive();
const oath2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oath2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oath2Client
})

// Lấy thời gian hiện tại
exports.getTimeNow = () => {
    return new Date().setMinutes(new Date().getMinutes() + 420);
};

//Chuyển string dạng dd/mm/yyyy về date dạng milisecond
exports._getTime = (dateString) => {
    // Tách ngày, tháng và năm từ chuỗi đầu vào
    const [day, month, year] = dateString.split('/');
    const dateObject = new Date(year, month - 1, day, 7);
    return dateObject.getTime();
}

//Chuyển đổi time về dạng string
exports.convertDate = (time = null, revert = false) => {
    let date;
    if (time != null) {
        date = new Date(time - 420 * 60 * 1000);
    } else {
        date = new Date();
    }
    const y = date.getFullYear();
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    if (!revert) {
        return `${d}/${m}/${y}`;
    } else {
        return `${y}/${m}/${d}`;
    }
};

//Hàm chuẩn hóa tiếng việt và thay " " thành "_"
exports.standardized = (input) => {
    // Loại bỏ các dấu tiếng Việt và chuyển thành chữ thường
    const normalizedStr = input
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-zA-Z0-9\s_]/g, "") // Thêm dấu _ vào mẫu để giữ nguyên
        .trim();

    // Chuyển khoảng trắng thành dấu "_"
    const underscoredStr = normalizedStr.replace(/\s+/g, "_");

    return underscoredStr;
}

//Hàm chuẩn hóa tiếng việt bỏ dấu
exports.standardized_2 = (input) => {
    // Loại bỏ các dấu tiếng Việt và chuyển thành chữ thường
    const normalizedStr = input
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();

    return normalizedStr;
}

// hàm check định dạng ảnh
exports.checkFile = (filePath) => {
    const extname = path.extname(filePath).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.pdf'].includes(extname);
};

//Hàm lấy id max
exports.getMaxId = async () => {
    let maxIdTL = (await The_loai.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;
    if (maxIdTL == 0) maxIdTL = 27

    let maxIdQTV = (await Quan_tri_vien.findOne({}).sort({ adm_id: -1 }).select("adm_id").then(data => data.adm_id).catch(err => 0)) || 0;
    if (maxIdQTV == 0) maxIdQTV = 1

    let maxIdT = (await Truyen.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;
    if (maxIdT == 0) maxIdT = 14

    let maxIdV = (await Voice.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;
    if (maxIdV == 0) maxIdV = 10

    let maxIdK = (await Key_voice.findOne({}).sort({ id: -1 }).select("id").then(data => data.id).catch(err => 0)) || 0;
    if (maxIdK == 0) maxIdK = 5

    return { maxIdTL, maxIdQTV, maxIdT, maxIdV, maxIdK };
}

//Kiểm tra kết nối đến drive
exports.checkConnectionDrive = async () => {
    try {
        // Gửi một yêu cầu đơn giản để kiểm tra kết nối
        await drive.files.list({}).then(data => data.data.files);

        return true;
    } catch (error) {
        console.error('Kiểm tra kết nối Google Drive thất bại:', error.message);
        return false;
    }
};

//Hàm upload nhiều ảnh lên GG Drive
exports.uploadImgToDriveAndResize = async (files, folderId = null, width = 600, height = 861) => {
    try {
        let fileIds = [];

        // Nếu chỉ có một file, chuyển thành mảng để xử lý dễ dàng
        if (!Array.isArray(files)) {
            files = [files];
        }

        // Lặp qua từng file và upload lên Google Drive
        for (const file of files) {
            if (file.size > 0) {
                // Resize ảnh và chuyển thành buffer ngay trong hàm
                const resizedImage = await sharp(file.path)
                    .resize(width, height) // Resize theo kích thước truyền vào
                    .toBuffer();

                // Tạo stream từ buffer
                const bufferStream = new PassThrough();
                bufferStream.end(resizedImage);

                // Upload ảnh đã resize lên Google Drive
                const fileId = await drive.files.create({
                    requestBody: {
                        name: file.name,
                        mimeType: file.type,
                        parents: folderId ? [folderId] : [] // Đặt folderId nếu có
                    },
                    media: {
                        mimeType: file.type,
                        body: bufferStream // Sử dụng buffer stream thay vì buffer trực tiếp
                    }
                }).then(data => data.data.id);

                // Thiết lập quyền public cho file
                await drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        role: "reader",
                        type: "anyone"
                    }
                });

                fileIds.push(fileId); // Lưu lại ID của file đã upload
            }
        }

        return fileIds; // Trả về mảng chứa các file_id
    } catch (error) {
        console.log(error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
};

//Hàm tạo thư mục theo tên trên GG Drive
exports.createFolder = async (folderName, parentId = null) => {
    try {
        const folder = await drive.files.create({
            requestBody: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: parentId ? [parentId] : [] // Thiết lập parent nếu có
            },
            fields: 'id'
        })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log('Lỗi:', error.response.data);
                return null; // Trả về null nếu lỗi
            });

        return folder?.data?.id; // Trả về ID của thư mục
    } catch (error) {
        console.error("Lỗi khi tạo thư mục");
        return null;
    }
};

//Hàm xóa file trên GG Drive
exports.deleteFileFromDrive = async (file_id) => {
    try {
        const status = await drive.files.delete({
            fileId: file_id
        })
            .then(data => { return data.status })
            .catch((error) => {
                console.error('Lỗi:', error.response.data);
                return null;
            });

        return status
    }
    catch (error) {
        console.log("Lỗi khi xóa file")
        return false
    }
}

//Public file cho mọi người xem
exports.setFilePublicDrive = async (file_id) => {
    try {
        const success = await drive.permissions.create({
            fileId: file_id,
            requestBody: {
                role: "reader",
                type: "anyone"
            }
        })
            .then((response) => {
                return true; // Trả về true nếu thành công
            })
            .catch((error) => {
                console.error('Lỗi:', error.response.data);
                return false; // Trả về false nếu lỗi
            });
        return success;
    }
    catch (error) {
        console.log("Lỗi khi public file")
        return false;
    }
}

//Lấy link public ảnh trên google drive
exports.getLinkPublicDrive = (file_id) => {
    return `https://drive.google.com/file/d/${file_id}/view?usp=drivesdk`
}

//Lấy danh sách id các file hoặc folder trong gg drive 
exports.getListFileFromDrive = async (folderId) => {
    let list_file = []
    try {
        if (folderId == "" || folderId == undefined || folderId == null) {
            list_file = await drive.files.list({}).then(data => data.data.files);
        }
        else {
            list_file = await drive.files.list({
                'q': `'${folderId}' in parents`
            }).then(data => data.data.files);
        }
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách id các file:', error.response.data);
        list_file = []; // Trả về danh sách rỗng nếu có lỗi
    }
    return list_file;
}

//Lấy danh sách id các file hoặc folder trong gg drive theo tên phục vụ cho seed
exports.getListFileFromDrive_1 = async (folderId, folderName = "") => {
    let list_file = []
    try {
        if (folderId == "" || folderId == undefined || folderId == null) {
            list_file = await drive.files.list({}).then(data => data.data.files);
        }
        else {
            if (folderName != "") {
                list_file = await drive.files.list({
                    'q': `'${folderId}' in parents and name = '${folderName}'`
                }).then(data => data.data.files);
            } else {
                // Nếu chỉ có folderId, lấy tất cả các file trong folderId
                list_file = await drive.files.list({
                    'q': `'${folderId}' in parents`
                }).then(data => data.data.files);
            }
        }
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách id các file:', error.response.data);
        list_file = []; // Trả về danh sách rỗng nếu có lỗi
    }
    return list_file;
}

//Lấy id folder trên google drive thông qua tên và trả về id
exports.getIdFolderDrive = async (folder_name) => {
    try {
        const id_bt_drive = await drive.files.list({
            q: `name='${folder_name}' and mimeType='application/vnd.google-apps.folder'`,
        })
            .then((response) => {
                const files = response.data.files;
                if (files.length > 0) {
                    return files[0].id;
                } else {
                    return ""
                }
            })
            .catch((error) => {
                console.error('Lỗi:', error.response.data);
                return ""
            });
        return id_bt_drive;
    }
    catch (error) {
        console.log("Lỗi khi tìm kiếm thư mục:", error.message);
        return "";
    }
}

//Lấy số lượng file trong 1 folder
exports.getNumberOfFiles = async (folderId) => {
    try {
        let count = 0

        if (folderId != "" && folderId != undefined && folderId != null) {
            let file_info = await drive.files.list({
                q: `'${folderId}' in parents`,
            })
                .then((data) => {
                    return data.data.files;
                })
                .catch((error) => {
                    console.error('Lỗi:', error.response.data);
                    return [];
                });
            count = file_info.length
        }
        return count;
    }
    catch (error) {
        console.log("Lỗi khi đếm số lượng file");
        return 0;
    }
}

//Kiểm tra kết nối mail
exports.checkConnectionMail = async () => {
    try {
        const mailConfig = await functions_mail.createConfigMail();

        if (!mailConfig) {
            return false;
        }

        const transporter = await nodemailer.createTransport(mailConfig);

        // Gửi email thử nghiệm
        await transporter.sendMail({
            from: '', // Địa chỉ email người gửi
            to: '', // Địa chỉ email người nhận
            subject: 'Test kết nối Gmail API',
            text: 'Đây là email kiểm tra kết nối Gmail API.'
        });

        return true;
    } catch (err) {
        console.error('Kiểm tra kết nối Gmail API thất bại:', err.message);
        return false;
    }
};

// //Hàm gửi mail
exports.sendMail = async (to, subject, text, html) => {
    try {
        const configMail = await functions_mail.createConfigMail();
        const mail = functions_mail.getMail();
        const transport = nodemailer.createTransport(configMail);
        const info = await transport.sendMail({
            from: mail,
            to: to,
            subject: subject,
            text: text,
            html: html
        })
        return info;
    }
    catch (err) {
        console.log("Lỗi khi gửi mail: ", err.message);
        return null;
    }
}

//Check nạp tiền
exports.checkPaid = async (price, content) => {
    const response = await axios.get("") //Điền mã script vào để lấy được thông tin thanh toán từ excel
        .then(data => data)
        .catch(err => err)

    const dataPaid = response.data.data[1];

    lastPrice = dataPaid['Giá trị'];
    lastContent = dataPaid['Mô tả'];
    if (lastPrice >= price && lastContent.includes(content)) {
        return true;
    }
    else {
        return false;
    }
}