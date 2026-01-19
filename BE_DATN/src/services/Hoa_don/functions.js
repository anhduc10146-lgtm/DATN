const functions = require('../functions');
const Hoa_don = require('../../models/Hoa_don');
const socket = require('../../config/socket');
const Thanh_vien = require('../../models/Thanh_vien');

async function monitorPayment(hoaDonId, soTien, content, _id) {
    const intervalTime = 1000; // 30 giây
    const timeoutTime = 300000; // 5 phút
    const hoaDon = await Hoa_don.findById(hoaDonId);
    const member = await Thanh_vien.findById({ _id: _id }).then(data => data);

    if (!hoaDon || hoaDon.trangThai !== 1) return; // Bỏ qua nếu giao dịch không hợp lệ

    const startTime = hoaDon.ngayTao;
    const timeElapsed = functions.getTimeNow() - startTime;
    const remainingTime = timeoutTime - timeElapsed;

    if (remainingTime <= 0) {
        // Quá thời gian, cập nhật trạng thái
        await Hoa_don.updateOne({ _id: hoaDonId }, { $set: { trangThai: 4 } });
        return;
    }

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
                    token: member.token,
                    content: `Bạn vừa nạp thành công ${soTien} VNĐ vào tài khoản`
                })
                return;
            }

            if (functions.getTimeNow() - startTime >= timeoutTime) {
                await Hoa_don.updateOne(
                    { _id: hoaDonId },
                    { $set: { trangThai: 4 } }
                );
                socket.emit('thanh-toan', {
                    success: false,
                    token: member.token,
                    content: `Giao dịch gần nhất đã bị hủy do quá thời gian thanh toán`
                })
                return;
            }

            setTimeout(() => {
                setImmediate(checkAndUpdate);
            }, intervalTime);
        } catch (error) {
            console.error("Lỗi trong quá trình kiểm tra thanh toán:", error.message);
            await Hoa_don.updateOne(
                { _id: hoaDonId },
                { $set: { trangThai: 2 } }
            );
            socket.emit('thanh-toan', {
                success: false,
                token: member.token,
                content: `Giao dịch bị lỗi do hệ thống, vui lòng liên hệ quản trị viên`
            })
        }
    }

    setTimeout(() => {
        setImmediate(checkAndUpdate);
    }, Math.max(0, intervalTime - timeElapsed % intervalTime));
}

exports.resumePendingPayments = async () => {
    const pendingPayments = await Hoa_don.find({ trangThai: 1 }); // 1: Đang xử lý
    for (const payment of pendingPayments) {
        monitorPayment(payment._id, payment.soTien, String(payment.ngayTao), payment.maThanhVien);
    }
}