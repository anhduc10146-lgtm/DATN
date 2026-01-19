/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Select, InputNumber, notification, QRCode } from "antd";
import s from './styles.module.scss'
import { GET, POST_FILE } from '../../../../api/baseAPI';

const ThongTinCaNhan = ({ setIsLoading }: { setIsLoading: any }) => {
    const access_token = localStorage.getItem('access_token');
    const anhDaiDien = localStorage.getItem('anhDaiDien') || "/avatar_img.png";
    const [email, setEmail] = useState("");
    const [ten, setTen] = useState(localStorage.getItem('ten') || "");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [ngaySinh, setNgaySinh] = useState("");
    const [ngayCapNhat, setNgayCapNhat] = useState("");
    const [ngayTao, setNgayTao] = useState("");
    const [gioiTinh, setGioiTinh] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [userInfo, setUserInfo] = useState<Record<string, string>>({});

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear(); // Năm

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }

    const thongTinTaiKhoan = async () => {
        try {
            setIsLoading(true);
            const data = await GET('api/admin/quan_ly_thong_tin/thong_tin_tai_khoan');
            if (data?.status === 200) {
                const userInfo = data?.data?.content;
                setTen(userInfo?.ten);
                setEmail(userInfo?.email);
                setSoDienThoai(userInfo?.soDienThoai);
                setNgaySinh(userInfo?.ngaySinh);
                setNgayCapNhat(userInfo?.ngayCapNhat);
                setNgayTao(userInfo?.ngayTao);
                setGioiTinh(userInfo?.gioiTinh);
            }
            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi lấy thông tin tài khoản`,
                duration: 3,
            });
        }
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setUserInfo((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            if (Object.keys(userInfo).length > 0) {
                Object.entries(userInfo).forEach(([key, value]) => {
                    formData.append(key, value);
                });
            }

            if (file) {
                formData.append("anhDaiDien", file);
            }

            const hasData = Array.from(formData.entries()).length > 0;

            if (hasData) {
                setIsLoading(true);
                const res = await POST_FILE('api/admin/quan_ly_thong_tin/cap_nhat_thong_tin', formData);
                setIsLoading(false);

                localStorage.setItem("ten", res?.data?.content?.ten);
                localStorage.setItem("anhDaiDien", res?.data?.content?.anhDaiDien);
                notification.success({
                    message: 'Hệ thống',
                    description: 'Cập nhật thông tin thành công',
                    showProgress: true,
                    duration: 3,
                });

                setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } else {
                notification.error({
                    message: 'Hệ thống',
                    description: 'Chỉ khi bạn thay đổi thông tin cá nhân, mới có thể cập nhật',
                    duration: 5,
                });
            }
        }
        catch (error) {
            notification.error({
                message: 'Hệ thống',
                description: 'Có lỗi xảy ra khi cập nhật thông tin',
                duration: 3,
            });
        }
    };

    const handleFileUpload = (e: any) => {
        setFile(e.target.files[0]);
    }

    useEffect(() => {
        if (access_token) {
            thongTinTaiKhoan();
        }
    }, [access_token])

    return (
        <div className={s.personalInfoContainer}>
            <h1>THÔNG TIN TÀI KHOẢN</h1>
            <div className={s.personalInfo}>
                <div className={s.avatarContainer}>
                    <img
                        src={anhDaiDien || "/avatar_img.png"}
                        alt="Avatar"
                        className={s.avatar}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        name="anhDaiDien"
                        onChange={handleFileUpload}
                        className={s.uploadAvatar}
                    />
                </div>

                <div className={s.infoFields}>
                    <div className={s.field}>
                        <label>Tên</label>
                        <input
                            type="text"
                            name="ten"
                            value={ten || ""}
                            onChange={(e: any) => { setTen(e.target.value); handleInputChange(e); }}
                        />
                    </div>

                    <div className={s.field}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e: any) => { setEmail(e.target.value); handleInputChange(e); }}
                            disabled={true}
                        />
                    </div>

                    <div className={s.field}>
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            name="soDienThoai"
                            value={soDienThoai}
                            onChange={(e: any) => { setSoDienThoai(e.target.value); handleInputChange(e); }}
                        />
                    </div>

                    <div className={s.field}>
                        <label>Ngày sinh</label>
                        <input
                            type="date"
                            name="ngaySinh"
                            value={ngaySinh}
                            onChange={(e: any) => { setNgaySinh(e.target.value); handleInputChange(e); }}
                        />
                    </div>

                    <div className={s.field}>
                        <label>Giới tính</label>
                        <select
                            name="gioiTinh"
                            value={gioiTinh}
                            onChange={(e: any) => { setGioiTinh(e.target.value); handleInputChange(e); }}
                        >
                            <option value={1}>Nam</option>
                            <option value={0}>Nữ</option>
                            <option value={2}>Khác</option>
                        </select>
                    </div>

                    <div className={s.field}>
                        <label>Ngày cập nhật</label>
                        {/* <input
                            type="date"
                            value={ngayCapNhat}
                            disabled
                        /> */}
                        <input
                            type="text"
                            value={formatDate(ngayCapNhat) || ""}
                            disabled={true}
                        />
                    </div>

                    <div className={s.field}>
                        <label>Ngày tạo</label>
                        {/* <input
                            type="date"
                            value={ngayCapNhat}
                            disabled
                        /> */}
                        <input
                            type="text"
                            value={formatDate(ngayTao) || ""}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
            <div className={s.updateButtonContainer}>
                <Button type="primary" onClick={handleUpdate}>
                    Cập nhật
                </Button>
            </div>
        </div>
    );
};

export default ThongTinCaNhan;