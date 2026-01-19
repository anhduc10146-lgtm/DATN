/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router'
import socket from "../../SocketManager"
import { notification } from 'antd'
import DashboardLayout from '../../layouts/DashboardLayout'

import ThongTinCaNhan from '../../pages/QuanTriVien/QuanLyTaiKhoan/ThongTinCaNhan'
import DoiMatKhau from '../../pages/QuanTriVien/QuanLyTaiKhoan/DoiMatKhau'

import QuanLyThongBao from '../../pages/QuanTriVien/QuanLyThanhVien/ThongBao'
import QuanLyThongTinThanhVien from '../../pages/QuanTriVien/QuanLyThanhVien/QuanLyThongTinTaiKhoan'

import TaiLenTruyen from '../../pages/QuanTriVien/QuanLyTruyen/TaiLenTruyen'
import TaiLenVoice from '../../pages/QuanTriVien/QuanLyTruyen/TaiLenVoice'
import TrangThaiTruyen from '../../pages/QuanTriVien/QuanLyTruyen/TrangThaiTruyen'
import QuanLyKey from '../../pages/QuanTriVien/QuanLyTruyen/QuanLyKey'
import TruyenDeXuat from '../../pages/QuanTriVien/QuanLyTruyen/TruyenDeXuat'
import { GET } from '../../api/baseAPI'

const QuanTriVienRoute = () => {
    const [tokenForce, setTokenForce] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [soLuongThongBao, setSoLuongThongBao] = useState(0);
    const isAuthenticated = localStorage.getItem("isAuthenticated") || "";
    const isAdmin = localStorage.getItem("isAdmin");

    let element = <DashboardLayout isLoading={isLoading} setIsLoading={setIsLoading} soLuongThongBao={soLuongThongBao} />;

    if (localStorage.getItem("isAuthenticated") !== "true")
        element = <Navigate to={"/login"} />
    else {
        element = isAdmin !== "true" ? <Navigate to={"/thanh-vien"} /> : <DashboardLayout isLoading={isLoading} setIsLoading={setIsLoading} soLuongThongBao={soLuongThongBao} />;
    }

    const handleForceLogout = (token: any, tokenForce: any) => {
        if (token === tokenForce) {
            notification.error({
                message: 'Thông báo',
                description: `Tài khoản của bạn đang đăng nhập ở nơi khác!!!`,
                duration: 3,
            });
            setTimeout(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem("ten");
                localStorage.removeItem("anhDaiDien");
                localStorage.setItem('isAuthenticated', 'false');
                window.location.href = '/login';
            }, 3000);
        }
    }

    const handleThongBao = async () => {
        try {
            setIsLoading(true);
            const res = await GET('api/admin/quan_ly_thanh_vien/so_luong_thong_bao_chua_doc');
            setIsLoading(false);
            if (res?.status === 200) {
                setSoLuongThongBao(res?.data?.content);
            }
            else {
                notification.error({
                    message: 'Lỗi khi lấy thông báo',
                    description: `${res?.data?.content}`,
                    showProgress: true,
                    duration: 3,
                });

            }

        }
        catch {
            notification.error({
                message: 'Hệ thống',
                description: 'Lỗi không xác định, vui lòng kiểm tra cơ sở dữ liệu!',
                duration: 3,
            });
        }
    }

    useEffect(() => {
        if (tokenForce !== "") {
            const access_token = localStorage.getItem('access_token');
            const isAdmin = localStorage.getItem('isAdmin');

            if (access_token !== "" && access_token !== undefined && access_token !== null && isAdmin === 'true') {
                handleForceLogout(access_token, tokenForce);
            }
        }
    }, [tokenForce])

    useEffect(() => {
        socket.on('force-logout', (data) => {
            const { token } = data;
            setTokenForce(token);
        });

        socket.on('uploadTruyen', (data) => {
            if (localStorage.getItem("isAuthenticated") === "true" && localStorage.getItem('isAdmin') === "true") {
                if (data.success) {
                    notification.success({
                        message: 'Hệ thống',
                        description: data.message,
                        duration: 0,
                    });
                }
                else {
                    notification.error({
                        message: 'Hệ thống',
                        description: data.message,
                        duration: 0,
                    });
                }
            }
        });
    }, [socket]);

    useEffect(() => {
        if (isAuthenticated === "true" && isAdmin === "true")
            handleThongBao()
    }, [
        isAuthenticated
    ])

    return {
        path: 'quan-tri-vien',
        element,
        children: [
            {
                path: '',
                element: <Navigate to={"/quan-tri-vien/quan-ly-tai-khoan/thong-tin-tai-khoan"} />,
            },
            {
                path: 'quan-ly-truyen',
                element: <Outlet />,
                children: [
                    {
                        path: 'tai-len-truyen',
                        element: <TaiLenTruyen setIsLoading={setIsLoading} />,
                    },
                    {
                        path: 'tai-len-voice',
                        element: <TaiLenVoice setIsLoading={setIsLoading} />,
                    },
                    {
                        path: 'trang-thai',
                        element: <TrangThaiTruyen setIsLoading={setIsLoading} />,
                    },
                    {
                        path: 'quan-ly-key',
                        element: <QuanLyKey setIsLoading={setIsLoading} />,
                    },
                    {
                        path: 'truyen-de-xuat',
                        element: <TruyenDeXuat setIsLoading={setIsLoading} />,
                    },
                ]
            },
            {
                path: 'quan-ly-tai-khoan',
                element: <Outlet />,
                children: [
                    {
                        path: 'thong-tin-tai-khoan',
                        element: <ThongTinCaNhan setIsLoading={setIsLoading} />,
                    },
                    {
                        path: 'doi-mat-khau',
                        element: <DoiMatKhau setIsLoading={setIsLoading} />,
                    }
                ]
            },
            {
                path: 'quan-ly-thanh-vien',
                element: <Outlet />,
                children: [
                    {
                        path: 'tai-khoan',
                        element: <QuanLyThongTinThanhVien setIsLoading={setIsLoading} />,
                    },
                    {
                        path: 'thong-bao',
                        element: <QuanLyThongBao setIsLoading={setIsLoading} setSoLuongThongBao={setSoLuongThongBao} />,
                    },
                ]
            }
        ]
    }
}

export default QuanTriVienRoute