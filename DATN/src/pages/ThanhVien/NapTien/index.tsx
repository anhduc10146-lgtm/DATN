/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Select, InputNumber, notification, QRCode } from "antd";
import s from './styles.module.scss'
import { GET, POST } from '../../../api/baseAPI';

const { Option } = Select;

const readyStatus = "0";
const waittingStatus = "1";
const completeStatus = "2";
const MY_BANK = {
    BANK_ID: "vietinbank",
    ACCOUNT_NO: "103870480117"
}

const NapTien = ({ setIsLoading }: { setIsLoading: any }) => {
    const ten = localStorage.getItem('ten');
    const access_token = localStorage.getItem('access_token');
    const [email, setEmail] = useState("");
    const [soDuTaiKhoan, setSoDuTaiKhoan] = useState(0);
    const [soTien, setSoTien] = useState<number>(0);
    const [noiDungChuyenKhoan, setNoiDungChuyenKhoan] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<string>("0");
    const [status, setStatus] = useState("0");
    const [qrCode, setQrCode] = useState("");
    const [loadingQr, setLoadingQr] = useState(false);

    const handlePayment = async () => {
        try {
            if (soTien === null || soTien <= 0) {
                notification.error({
                    message: 'Thông báo',
                    description: `Vui lòng nhập số tiền hợp lệ`,
                    duration: 3,
                });
                return;
            }
            else {
                setIsLoading(true);
                var formData = new FormData();
                formData.append("soTien", String(soTien));
                const response = await POST('api/member/quan_ly_nap_tien/nap_tien_vao_tai_khoan', formData);
                setIsLoading(false);
                if (response?.status === 200) {
                    setNoiDungChuyenKhoan(response?.data?.noiDungChuyenKhoan)
                    setQrCode(`https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-qr_only.png?amount=${soTien}&addInfo=${response?.data?.noiDungChuyenKhoan}`)
                    setStatus(waittingStatus);
                    notification.success({
                        message: 'Thông báo',
                        description: `Tiến hành quét mã QR để tiến hành thanh toán`,
                        duration: 3,
                    });

                    setTimeout(() => {
                        setLoadingQr(true);
                    }, 3000);
                }
                else {
                    notification.error({
                        message: 'Thông báo',
                        description: response?.data?.content,
                        duration: 3,
                    });
                }
            }
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: `Có lỗi xảy ra vui lòng thực hiện giao dịch khác`,
                duration: 3,
            });
        }

    };

    const handleOtherTransactions = () => {
        setStatus(readyStatus);
        setSoTien(0);
        setNoiDungChuyenKhoan("");
        setPaymentMethod("0");
    }

    const thongTinTaiKhoan = async () => {
        try {
            setIsLoading(true);
            const data = await GET('api/member/quan_ly_thong_tin/thong_tin_tai_khoan');
            if (data.status === 200) {
                setSoDuTaiKhoan(data.data.content.soDuTaiKhoan);
                setEmail(data.data.content.email);
            }
            setIsLoading(false);
        }
        catch (error) {
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi không xác định`,
                duration: 3,
            });
        }
    }

    useEffect(() => {
        if (access_token) {
            thongTinTaiKhoan()
        }
    }, [access_token])

    return (
        <>
            <h1 className={s.title} style={{ textAlign: "center", marginBottom: 24, fontWeight: "bold" }}>THÔNG TIN GIAO DỊCH</h1 >
            <div style={{ marginBottom: 16 }}>
                <strong>Họ và tên:</strong> {ten}
            </div>

            <div style={{ marginBottom: 16 }}>
                <strong>Email:</strong> {email}
            </div>

            <div style={{ marginBottom: 16 }}>
                <strong>Số dư tài khoản:</strong> {soDuTaiKhoan} VNĐ
            </div>

            <div style={{ marginBottom: 16 }}>
                <strong>Nội dung chuyển khoản:</strong> {noiDungChuyenKhoan}
            </div>

            {
                status === readyStatus &&
                <>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Số tiền nạp:</strong>
                        <InputNumber
                            style={{ width: "100%", marginTop: 8 }}
                            min={0}
                            placeholder="Nhập số tiền cần nạp"
                            value={soTien}
                            onChange={(value: any) => setSoTien(value)}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <strong>Thanh toán qua:</strong>
                        <Select
                            style={{ width: "100%", marginTop: 8 }}
                            value={paymentMethod === "0" ? "Chuyển khoản ngân hàng Vietinbank - 103870480117 - PHAM VIET HOANG" : "Momo"}
                            onChange={(value) => setPaymentMethod(value)}
                        >
                            <Option value="0">Chuyển khoản ngân hàng Vietinbank - 103870480117 - PHAM VIET HOANG</Option>
                        </Select>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button type="primary" onClick={handlePayment}>
                            Tiến hành thanh toán
                        </Button>
                    </div>
                </>
            }

            {
                status === waittingStatus &&
                <>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Số tiền nạp:</strong> {soTien} VNĐ
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Phương thức thanh toán:</strong> {paymentMethod === "0" ? "Chuyển khoản ngân hàng Vietinbank - 103870480117 - PHAM VIET HOANG" : "Momo"}
                    </div>

                    <div style={{ marginBottom: 16, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {loadingQr ? <img alt="example" src={qrCode} height={158} width={158} /> : <QRCode value={"https://ant.design/"} status="loading" />}
                    </div>

                    <div style={{ display: "flex", justifyContent: "end" }}>
                        <Button type="primary" onClick={handleOtherTransactions}>
                            Thực hiện giao dịch khác
                        </Button>
                    </div>
                </>
            }
        </>
    );
};

export default NapTien;