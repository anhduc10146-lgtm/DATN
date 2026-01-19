/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { Navigate, useRoutes } from 'react-router'
import { Outlet } from 'react-router'
import QuanTriVienRoute from '../QuanTriVienRoute'
import ThanhVienRoute from '../ThanhVienRoute'
import HomePage from '../../pages/HomePage'
import TheLoai from '../../pages/TheLoai'
import TimKiem from '../../pages/TimKiem'
import ChiTiet from '../../pages/ChiTiet'
import DocTruyen from '../../pages/DocTruyen'
import HomePageLayout from '../../layouts/HomePageLayout'
import Test from '../../pages/Test'
import Login from '../../pages/Auth/Login'
import Register from '../../pages/Auth/Register'
import Verify from '../../pages/Auth/Verify'
import ForgetPassword from '../../pages/Auth/ForgetPassword'
import NotFound from '../../pages/NotFound'
import socket from "../../SocketManager"
import { notification } from 'antd'

const RootRoute = () => {
    const quanTriVienRoute = QuanTriVienRoute();
    const thanhVienRoute = ThanhVienRoute();
    const [tokenForce, setTokenForce] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<any>(localStorage.getItem("isAuthenticated"));
    let element = <Outlet />;
    let element1 = <Outlet />;

    if (isAuthenticated === "true") {
        const isAdmin: any = localStorage.getItem("isAdmin");
        element = isAdmin === "true" ? <Navigate to={"/quan-tri-vien"} /> : <Navigate to={"/thanh-vien"} />
        element1 = <Outlet />;
    }
    else {
        element1 = <Navigate to={"/"} />
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
                setIsAuthenticated('false');
                window.location.href = '/';
            }, 3000);
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
    }, [socket]);

    return useRoutes([
        {
            path: '',
            element: <HomePageLayout isLoading={isLoading} setIsLoading={setIsLoading} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />,
            children: [
                {
                    path: '',
                    element: <HomePage setIsLoading={setIsLoading} isAuthenticated={isAuthenticated} />
                },
                {
                    path: 'the-loai/:id',
                    element: <TheLoai />
                },
                {
                    path: 'tim-kiem/:key',
                    element: <TimKiem />
                },
                {
                    path: 'chi-tiet/:id',
                    element: element1,
                    children: [
                        {
                            path: '',
                            element: <ChiTiet setIsLoading={setIsLoading} isAuthenticated={isAuthenticated} />
                        }
                    ]
                },
                {
                    path: 'doc/:idBoTruyen/:tapSo',
                    element: element1,
                    children: [
                        {
                            path: '',
                            element: <DocTruyen setIsLoading={setIsLoading} />
                        }
                    ]
                }
            ]
        },
        {
            path: 'login',
            element,
            children: [
                {
                    path: '',
                    element: <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />,
                }
            ]
        },
        {
            path: 'register',
            element,
            children: [
                {
                    path: '',
                    element: <Register />,
                }
            ]
        },
        {
            path: 'forget-password',
            element,
            children: [
                {
                    path: '',
                    element: <ForgetPassword />,
                }
            ]
        },
        {
            path: 'user/verify/:id/:token',
            element,
            children: [
                {
                    path: '',
                    element: <Verify />,
                }
            ]
        },
        thanhVienRoute,
        quanTriVienRoute,
        {
            path: '*',
            element: <NotFound />
        }
    ])
}

export default RootRoute