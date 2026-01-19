const DeleteSeed = require('../../seed/DeleteSeed');
const QuanTriVienSeed = require('../../seed/QuanTriVienSeed');
const TheLoaiSeed = require('../../seed/TheLoaiSeed');
const ThanhVienSeed = require('../../seed/ThanhVienSeed');
const KeyVoiceSeed = require('../../seed/KeyVoiceSeed');
const KeyApiGoogleSeed = require('../../seed/KeyApiGoogleSeed');
const BoTruyenSeed = require('../../seed/BoTruyenSeed');
const TruyenSeed = require('../../seed/TruyenSeed');
const VoiceSeed = require('../../seed/VoiceSeed');
const LienKetSeed = require('../../seed/LienKetSeed');

const Bo_truyen = require('../../models/Bo_truyen');

const functions = require('../../services/functions');

exports.createSeed = async (req, res) => {
    try {
        const data = req.body;

        const key_api_google = await KeyApiGoogleSeed.seed(data);
        if (key_api_google) {
            await DeleteSeed.seed();
            const key_voice = await KeyVoiceSeed.seed();
            const data_tl = await TheLoaiSeed.seed();
            const data_qtv = await QuanTriVienSeed.seed(req.files);
            const thanh_vien = await ThanhVienSeed.seed(req.files);
            const bo_truyen = await BoTruyenSeed.seed(req.files);
            const truyen = await TruyenSeed.seed();
            const voice = await VoiceSeed.seed();
            await LienKetSeed.seed();
            console.log('Hoàn thành quá trình tạo dữ liệu mẫu')
            return res.status(200).json({
                success: true,
                message: "Tạo dữ liệu mẫu thành công",
                content: {}
            });
        }
        else {
            console.log("Chưa thể tạo dữ liệu mẫu do chưa kết nối được đến drive hoặc mail")
            return res.status(400).json({
                success: true,
                message: "Tạo dữ liệu mẫu không thành công",
                content: {}
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err.message
        });
    }
}

exports.taoXacTruyen = async (req, res) => {
    try {
        const data = req.body;

        const { ten, tomTat, tacGia, theLoai, gioiHanQuyenDoc, gioiHanLuaTuoi, giaBanQuyen, soLuong } = data;

        // Kiểm tra các trường trong req.body
        for (const field of ["ten", "tomTat", "tacGia", "theLoai", "gioiHanQuyenDoc", "gioiHanLuaTuoi", "giaBanQuyen", "soLuong"]) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `Trường '${field}' không được để trống hoặc undefined` });
            }
        }
        const now = functions.getTimeNow();
        const data_new = [];

        for (let i = 0; i < parseInt(soLuong, 10); i++) {
            const ten_new = ten + ` ${i + 1}`;
            data_new.push({
                ten: ten_new,
                soTapHienTai: 1,
                trangThai: 2,
                tomTat: tomTat,
                tacGia: tacGia,
                theLoai: data.theLoai ? data.theLoai.split(",").map(Number) : [],
                ngayDang: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: Number(gioiHanQuyenDoc),
                gioiHanLuaTuoi: Number(gioiHanLuaTuoi),
                soLuotTruyCap: 0,
                giaBanQuyen: Number(giaBanQuyen),
                trangBia: functions.standardized(ten) + `_${i + 1}` + `_img`
            })
        }

        await Bo_truyen.create(...data_new)
            .then(data => {
                console.log(`Tạo xác truyện '${ten}' thành công`)
            })

        return res.status(200).json({
            success: true,
            message: "Tạo xác truyện thành công",
            content: {}
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err
        });
    }

}

exports.xoaXacTruyen = async (req, res) => {
    try {
        const data = req.body;

        const { ten } = data;

        // Kiểm tra các trường trong req.body
        for (const field of ["ten"]) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `Trường '${field}' không được để trống hoặc undefined` });
            }
        }

        const regex = new RegExp(`^${ten} \\d+$`);

        // Tìm bản ghi gốc (ten)
        const originalRecord = await Bo_truyen.findOne({ ten: ten });
        if (!originalRecord) {
            return res.status(400).json({
                success: true,
                message: `Không tìm thấy truyện có tên: ${ten}`,
                content: {}
            });;
        }

        const deleteResult = await Bo_truyen.deleteMany({ ten: { $regex: regex } })
            .then(data => {
                console.log(`Xoá xác truyện '${ten}' thành công`);
                return data
            })

        return res.status(200).json({
            success: true,
            message: `Xóa xác ${deleteResult.deletedCount} truyện thành công`,
            content: {}
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra",
            content: err
        });
    }
}