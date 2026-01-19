/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { notification } from 'antd'
import socket from "../../SocketManager"

import DashboardLayout from '../../layouts/DashboardLayout'
import NapTien from '../../pages/ThanhVien/NapTien'
import LichSuGiaoDich from '../../pages/ThanhVien/LichSuGiaoDich'
import ThongTin from '../../pages/ThanhVien/ThongTinCaNhan'
import DoiMatKhau from '../../pages/ThanhVien/DoiMatKhau'
import LichSuDocTruyen from '../../pages/ThanhVien/LichSuDocTruyen'
import TruyenYeuThich from '../../pages/ThanhVien/TruyenYeuThich'
import NangCapTaiKhoan from '../../pages/ThanhVien/NangCapTaiKhoan'
import DeXuatTruyen from '../../pages/ThanhVien/DeXuatTruyen'
import { access } from 'fs'

const ThanhVienRoute = () => {
    const [tokenForce, setTokenForce] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    let element =
        <DashboardLayout isLoading={isLoading} setIsLoading={setIsLoading} soLuongThongBao={0} />;


    if (localStorage.getItem("isAuthenticated") !== "true")
        element = <Navigate to={"/login"} />
    else {
        const isAdmin: any = localStorage.getItem("isAdmin");
        element = isAdmin === "true" ? <Navigate to={"/quan-tri-vien"} /> : <DashboardLayout isLoading={isLoading} setIsLoading={setIsLoading} soLuongThongBao={0} />;
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

    useEffect(() => {
        if (tokenForce !== "") {
            const access_token = localStorage.getItem('access_token');
            const isAdmin = localStorage.getItem('isAdmin');

            if (access_token !== "" && access_token !== undefined && access_token !== null && isAdmin === 'false') {
                handleForceLogout(access_token, tokenForce);
            }
        }
    }, [tokenForce])

    useEffect(() => {
        socket.on('force-logout', (data) => {
            const { token } = data;
            setTokenForce(token);
        });
        socket.on('thanh-toan', (data) => {
            const access_token = localStorage.getItem("access_token");
            if (data.token === access_token) {
                notification.success({
                    message: 'Thông báo',
                    description: data.content,
                    duration: 3,
                });
            }
        });
    }, [socket]);

    return {
        path: 'thanh-vien',
        element,
        children: [
            {
                path: '',
                element: <Navigate to={"thong-tin"} />,
            },
            {
                path: 'thong-tin',
                element: <ThongTin setIsLoading={setIsLoading} />,
            },
            {
                path: 'doi-mat-khau',
                element: <DoiMatKhau setIsLoading={setIsLoading} />,
            },
            {
                path: 'lich-su-doc-truyen',
                element: <LichSuDocTruyen setIsLoading={setIsLoading} />,
            },
            {
                path: 'truyen-yeu-thich',
                element: <TruyenYeuThich setIsLoading={setIsLoading} />,
            },
            {
                path: 'nang-cap-tai-khoan',
                element: <NangCapTaiKhoan setIsLoading={setIsLoading} />,
            },
            {
                path: 'quan-ly-nap-tien',
                children: [
                    {
                        path: 'nap-tien-tai-khoan',
                        element: <NapTien setIsLoading={setIsLoading} />,
                    },
                    {
                        path: 'lich-su-giao-dich',
                        element: <LichSuGiaoDich setIsLoading={setIsLoading} />
                    }
                ]
            }
            , {
                path: 'de-xuat-truyen',
                element: <DeXuatTruyen setIsLoading={setIsLoading} />,
            }
        ]
    }
}

export default ThanhVienRoute