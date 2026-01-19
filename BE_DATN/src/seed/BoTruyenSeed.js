/******************************************************************** 
*                                                                   *
*   *
*                                                                   *
* File này chạy riêng không liên quan gì đến file main.js           *
*                                                                   *
*********************************************************************/

const mongoose = require('mongoose');
const chalk = require('chalk');
const Bo_truyen = require('../models/Bo_truyen');
const functions = require('../services/functions');
const functions_bt = require('../services/Bo_truyen/functions');

require('dotenv').config();

// Tự connect tới database
mongoose.connect(process.env.BUILD_MODE === 'dev' ? process.env.MONGO_DB_CONNECT_DEV : process.env.MONGO_DB_CONNECT_PRODUCTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.seed = async function (data) {
    try {
        //Lấy thời gian tạo truyện
        const now = functions.getTimeNow();

        //Tải ảnh lên 
        let dragon_ball_rise_img = ""
        let doc_thu_vu_y_img = ""
        let dragon_ball_mutiverse_img = ""
        let dragon_ball_super_img = ""
        let jiren_vs_broly_img = ""
        let onepunch_man_img = ""
        let ta_la_han_tam_thien_img = ""
        let ta_o_nha_100_nam_img = ""
        let tien_ton_lac_vo_cuc_img = ""
        let to_su_xuat_son_img = ""

        if (JSON.stringify(data) != '{}') {
            if (data.dragon_ball_rise_img && data.dragon_ball_rise_img.size > 0)
                dragon_ball_rise_img = await functions_bt.uploadCoverResize(data.dragon_ball_rise_img, now)

            if (data.doc_thu_vu_y_img && data.doc_thu_vu_y_img.size > 0)
                doc_thu_vu_y_img = await functions_bt.uploadCoverResize(data.doc_thu_vu_y_img, now)

            if (data.dragon_ball_mutiverse_img && data.dragon_ball_mutiverse_img.size > 0)
                dragon_ball_mutiverse_img = await functions_bt.uploadCoverResize(data.dragon_ball_mutiverse_img, now)

            if (data.dragon_ball_super_img && data.dragon_ball_super_img.size > 0)
                dragon_ball_super_img = await functions_bt.uploadCoverResize(data.dragon_ball_super_img, now)

            if (data.jiren_vs_broly_img && data.jiren_vs_broly_img.size > 0)
                jiren_vs_broly_img = await functions_bt.uploadCoverResize(data.jiren_vs_broly_img, now)

            if (data.onepunch_man_img && data.onepunch_man_img.size > 0)
                onepunch_man_img = await functions_bt.uploadCoverResize(data.onepunch_man_img, now)

            if (data.ta_la_han_tam_thien_img && data.ta_la_han_tam_thien_img.size > 0)
                ta_la_han_tam_thien_img = await functions_bt.uploadCoverResize(data.ta_la_han_tam_thien_img, now)

            if (data.ta_o_nha_100_nam_img && data.ta_o_nha_100_nam_img.size > 0)
                ta_o_nha_100_nam_img = await functions_bt.uploadCoverResize(data.ta_o_nha_100_nam_img, now)

            if (data.tien_ton_lac_vo_cuc_img && data.tien_ton_lac_vo_cuc_img.size > 0)
                tien_ton_lac_vo_cuc_img = await functions_bt.uploadCoverResize(data.tien_ton_lac_vo_cuc_img, now)

            if (data.to_su_xuat_son_img && data.to_su_xuat_son_img.size > 0)
                to_su_xuat_son_img = await functions_bt.uploadCoverResize(data.to_su_xuat_son_img, now)
        }

        const data_bo_truyen = [
            {
                ten: "Dragon Ball Rise",
                soTap: 1,
                trangThai: 2,
                tomTat: "Nếu Gohan không thể chiến thắng trong Cell Game thì Cell sẽ tiến hóa lên 1 hình dạng mới và như thế hành trình luyện tập để nâng giới hạn sức mạnh mới của GoHan và GoKu sẽ bắt đầu. Hãy cùng đón đọc nhé",
                tacGia: "Akira Toriyama",
                theLoai: [21],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 0,
                giaBanQuyen: 50000,
                giaBan: 10000,
                trangBia: dragon_ball_rise_img
            },
            {
                ten: "Độc Thủ Vũ Y",
                soTap: 1,
                trangThai: 2,
                tomTat: "Sinh ra đã mang bệnh nan y cửu tử nhất sinh chỉ sống không quá 15 tuổi, nhưng một ngày nọ gặp được một vu y pháp thuật cao siêu đưa lên núi làm đệ tử, năm 20 tuổi xuống núi bắt đầu xuống núi hàng nghề y",
                tacGia: "",
                theLoai: [12, 22, 23],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 20,
                giaBanQuyen: 50000,
                giaBan: 10000,
                trangBia: doc_thu_vu_y_img
            },
            {
                ten: "Dragon Ball Mutiverse",
                soTap: 1,
                trangThai: 2,
                tomTat: "Thế giới này tồn tại không chỉ một vũ trụ, mà còn tồn tại song song rất rất nhiều vũ trụ khác nhau. Và đương nhiên Sôn Gô Ku và các bạn của mình cũng sẽ tồn tại song song ở các vũ trụ khác nhau, Tất cả bọn họ đã được tập hợp tham gia một cuộc thi đấu. Sẽ có chuyện gì bất ngờ xảy ra tại đây…",
                tacGia: "Gogeta Jr, Salagir",
                theLoai: [21],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 30,
                giaBanQuyen: 100000,
                giaBan: 10000,
                trangBia: dragon_ball_mutiverse_img
            },
            {
                ten: "Dragon Ball Super",
                soTap: 1,
                trangThai: 2,
                tomTat: "Câu chuyện của Dragon Ball Super diễn ra ngay sau khi chiến đấu với Ma Nhân Bư, cuộc sống ở trái đất lại được hòa bình thêm 1 lần nữa. Sau đó vì nhà gần như hết tiền để chi tiêu Chichi tiền ra lệnh cho Goku phải đi kiếm tiền, và không được phép luyện tập trong thời gian này!! Videl sắp trở thành chị dâu của Goten nên Goten đã đặt ra một cuộc hành trình cùng với TRunks để tìm cho Videl một món quà! Nhưng rồi ở 1 nơi xa xăm trong vũ trụ, 1 điều khủng khiếp sẽ đến....",
                tacGia: "Akira Toriyama",
                theLoai: [24],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 15,
                giaBanQuyen: 0,
                giaBan: 0,
                trangBia: dragon_ball_super_img
            },
            {
                ten: "Jiren Vs Broly",
                soTap: 1,
                trangThai: 2,
                tomTat: "Sau giải đấu sức mạnh, Jiren vẫn tiếp tục tập luyện và mạnh lên từng ngày. Goku trở thành bạn với Broly sau trận chiến long trời lở đất, và cả 3 có dịp tái ngộ nhau trong 1 trận chiến...",
                tacGia: "Jordan Lee và Monty Black",
                theLoai: [21],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 16,
                giaBanQuyen: 70000,
                giaBan: 20000,
                trangBia: jiren_vs_broly_img
            },
            {
                ten: "Onepunch Man",
                soTap: 1,
                trangThai: 2,
                tomTat: "Một Manga thể loại siêu anh hùng với đặc trưng phồng tôm đấm phát chết luôn... và mang đậm tính chất troll của tác giả. Onepunch-man là câu chuyện của 1 chàng thanh niên 23 tuổi, đang là một nhân viên văn phòng điển trai nghiêm túc và tất nhiên là ế. Không hiểu vì biến cố gì mà tự nhiên lông tóc trên người của anh trụi lủi, sau đó anh mang trong mình khả năng siêu đặc biệt \"Đấm phát chết luôn\" nhằm bảo vệ trái đất và thành phố nơi anh sinh sống khỏi các sinh vật ngoài không gian (nhưng phá hoại cũng không kém).",
                tacGia: "Murata Yuusuke",
                theLoai: [26],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 17,
                giaBanQuyen: 0,
                giaBan: 0,
                trangBia: onepunch_man_img
            },
            {
                ten: "Ta Là Hàn Tam Thiên",
                soTap: 1,
                trangThai: 2,
                tomTat: "Truyện tranh Ta Là Hàn Tam Thiên được cập nhật nhanh và đầy đủ nhất tại NetTruyen. Bạn đọc đừng quên để lại bình luận và chia sẻ, ủng hộ NetTruyen ra các chương mới nhất của truyện Ta Là Hàn Tam Thiên.",
                tacGia: "Đang cập nhật",
                theLoai: [5, 12, 23],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 14,
                giaBanQuyen: 50000,
                giaBan: 10000,
                trangBia: ta_la_han_tam_thien_img
            },
            {
                ten: "Ta ở nhà 100 năm khi ra ngoài đã vô địch",
                soTap: 1,
                trangThai: 2,
                tomTat: "Rõ ràng xuyên qua thành huyền huyễn thế giới cường đại thế gia thiếu gia, lại bị phạt ra tổ trạch, ở đến vắng vẻ tiểu viện!? Sở Huyền Nhất điểm đều không thèm để ý, ta thế nhưng là có càng trạch càng mạnh hệ thống! Chỉ cần ta đầy đủ trạch! Ta liền có thể đủ mạnh! Đinh ~ Trạch một ngày, ban thưởng Kim Cương Bất Hoại thần công...... Đinh ~ Trạch một năm, thưởng ban thưởng Ngọc Hư Tiên Kinh + Trăm năm tu vi...... Đinh ~ Trạch mười năm, ...... Ai cũng đừng nghĩ để cho ta sở huyền đi ra ngoài, ta liền muốn ở nhà trạch lấy!",
                tacGia: "Đang cập nhật",
                theLoai: [1, 12, 23],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 16,
                giaBanQuyen: 50000,
                giaBan: 10000,
                trangBia: ta_o_nha_100_nam_img
            },
            {
                ten: "Tiên Tôn Lạc Vô Cực",
                soTap: 1,
                trangThai: 2,
                tomTat: "Tiên tôn lạc vô cực bị phong ấn sức mạnh và trờ thành người thường và đưa về thế giới tu tiên giả, liệu sau khi trở thành người thường anh có trờ lại thời ký đỉnh phong được hay không hãy cùng đón đọc nhé",
                tacGia: "Đang cập nhật",
                theLoai: [1, 2, 4, 12, 23],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 18,
                giaBanQuyen: 50000,
                giaBan: 10000,
                trangBia: tien_ton_lac_vo_cuc_img
            },
            {
                ten: "Tổ Sư Xuất Sơn",
                soTap: 1,
                trangThai: 2,
                tomTat: "Diệp Tuyệt Vũ,Là một người tu tiên thời xưa,Bế quan suốt 500 năm cuối cùng cũng đã xuất quan!Nhưng lại phát hiện thế giới đã thay đổi rồi...",
                tacGia: "Đang cập nhật",
                theLoai: [12, 23],
                ngayDang: now,
                ngayTao: now,
                thoiGianCapNhat: now,
                gioiHanQuyenDoc: 0,
                gioiHanLuaTuoi: 13,
                soLuotTruyCap: 20,
                giaBanQuyen: 500000,
                giaBan: 5000,
                trangBia: to_su_xuat_son_img
            }
        ]

        //Tạo dữ liệu mới
        const bo_truyen = await Bo_truyen.create(...data_bo_truyen)
            .then(data => {
                console.log(chalk.green("Tạo bộ truyện mẫu thành công"));
                return data
            })
            .catch(err => console.log(err))
        return bo_truyen;
    }
    catch (err) {
        console.log('Lỗi Bộ truyện Seed: ', err, '\n Lỗi Bộ truyện Seed');
        return;
    }
}



