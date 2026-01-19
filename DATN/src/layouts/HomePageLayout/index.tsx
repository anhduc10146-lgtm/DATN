/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Input, Button, Menu, Drawer, Avatar, Image, Dropdown, Table, Spin, notification } from 'antd';
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import s from './styles.module.scss';
import { Divider } from 'antd/lib';
import './index.css';
import { POST } from '../../api/baseAPI';

const { Header } = Layout;


const genres = [
    'Thể loại 1',
    'Thể loại 2',
    'Thể loại 3',
    'Thể loại 4',
    'Thể loại 5',
    'Thể loại 6',
    'Thể loại 7',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
    'Thể loại 8',
];

const HomePageLayout = ({
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated
}: {
    isLoading: any,
    setIsLoading: any,
    isAuthenticated: any,
    setIsAuthenticated: any
}) => {
    const navigate = useNavigate();

    const isAdmin: any = localStorage.getItem('isAdmin') || 'false';
    const anhDaiDien = localStorage.getItem('anhDaiDien');
    const ten = localStorage.getItem('ten');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [listTheLoai, setListTheLoai] = useState([]);

    const handleLogout = async () => {
        try {
            var formData = new FormData();
            formData.append("isAdmin", isAdmin);

            setIsLoading(true);
            const res = await POST('api/authenticate/dang_xuat', formData);
            setIsLoading(false);
            if (res?.status === 200) {

                notification.success({
                    message: 'Đăng xuất thành công',
                    description: 'Đang chuyển hướng!',
                    showProgress: true,
                    duration: 3,
                });

                setTimeout(() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('isAdmin');
                    localStorage.removeItem("ten");
                    localStorage.removeItem("anhDaiDien");
                    localStorage.setItem('isAuthenticated', 'false');
                    setIsAuthenticated('false');
                }, 3000);

            }
            else {
                notification.error({
                    message: 'Đăng xuất thất bại',
                    description: `${res?.data?.content}`,
                    showProgress: true,
                    duration: 3,
                });

            }

        }
        catch {
            notification.error({
                message: 'Đăng xuất thất bại',
                description: 'Lỗi không xác định, vui lòng kiểm tra cơ sở dữ liệu!',
                duration: 3,
            });
        }
    }

    const DanhSachTheLoai = async () => {
        try {
            var formData = new FormData();
            formData.append("page", String(1));
            formData.append("pageSize", String(1000));

            setIsLoading(true);
            const res = await POST('api/homepage/quan_ly_truyen/danh_sach_the_loai', formData);
            setIsLoading(false);
            if (res?.status === 200) {
                setListTheLoai(res?.data?.content);
            }
            else {
                notification.error({
                    message: res?.data?.massage,
                    description: `${res?.data?.content}`,
                    duration: 3,
                });

            }
        }
        catch {
            notification.error({
                message: 'Danh sách thể loại',
                description: 'Lỗi khi lấy danh sách thể loại',
                duration: 3,
            });
        }
    }

    const genreGrid = (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            {listTheLoai && listTheLoai.map((theLoai: any, index: any) => (
                <div
                    key={index}
                    style={{
                        padding: '10px',
                        textAlign: 'center',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                    onClick={() => window.location.replace(`/the-loai/${theLoai.id}`)}
                    className="the-loai-1"
                >
                    {theLoai.ten}
                </div>
            ))}
        </div>
    );

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/register");
    };

    useEffect(() => {
        DanhSachTheLoai()
    }, []);

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    return (
        <div className={s.home_page}>
            {isLoading && (
                <div className={s.overlay}>
                    <Spin
                        indicator={<LoadingOutlined style={{ fontSize: 48, color: '#fff' }} spin />}
                    />
                </div>
            )}

            <Header className={s.header}>
                <div className={s.headerContent}>
                    <div className={s.logo} onClick={() => navigate("/")}>
                        <Image src={'/logo_web_white.png'} width={60} height={60} />
                        WEB TRUYỆN 2601
                    </div>

                    <div className={s.searchBar}>
                        <Input.Search placeholder="Tìm kiếm truyện..." enterButton />
                    </div>

                    <div>
                        <Dropdown overlay={genreGrid} trigger={['hover']} className={s.dropdownMenu}>
                            <Button type="text" style={{ color: "white", fontWeight: "bold" }}>
                                THỂ LOẠI
                            </Button>
                        </Dropdown>
                    </div>

                    <div className={s.accountSection}>
                        {isAuthenticated === 'true' ? (
                            <div className={s.loggedIn}>
                                <Avatar style={{ marginRight: '10px', backgroundColor: 'white', cursor: 'pointer' }} src={anhDaiDien || '/assets/images/avatar.svg'} alt="Avatar" onClick={() => { navigate("/thanh-vien"); }} />
                                <Button onClick={handleLogout} color="danger" variant="solid">
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            <div className={s.loggedOut}>
                                <Button onClick={handleLogin} color="primary" variant="solid">
                                    Đăng nhập
                                </Button>
                                <Button onClick={handleRegister} color="danger" variant="solid">
                                    Đăng ký
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    className={s.menuButton}
                    icon={<MenuOutlined />}
                    onClick={toggleDrawer}
                />
            </Header>

            <Drawer
                placement="right"
                closable
                onClose={toggleDrawer}
                open={drawerVisible}
                className={s.drawer}
            >
                {isAuthenticated === 'true' ? (
                    <div className={s.userInfo}>
                        <Avatar style={{ marginBottom: '10px', height: ' 45px', width: '45px' }} src={anhDaiDien || "/assets/images/avatar.svg"} alt="Avatar" />
                        <span className={s.ten} style={{ marginBottom: '10px' }}>Hi, {ten}</span>
                        <Button
                            type="text"
                            style={{ marginBottom: '10px', fontWeight: 'bold' }}
                            onClick={handleLogout}
                            color="danger"
                            variant="solid"
                        >
                            Đăng xuất
                        </Button>
                    </div>
                ) : (
                    <div className={s.authButtons} style={{ marginBottom: 16 }}>
                        <Button color="primary" variant="solid" onClick={handleLogin} style={{ marginRight: 10, fontWeight: 'bold' }}>
                            Đăng nhập
                        </Button>
                        <Button color="danger" variant="solid" onClick={handleRegister} style={{ fontWeight: 'bold' }}>
                            Đăng ký
                        </Button>
                    </div>
                )}

                <Input.Search placeholder="Tìm kiếm truyện..." enterButton style={{ marginBottom: 16 }} />
                <Menu mode="vertical">
                    <Menu.Item onClick={() => navigate("/the-loai/1")}>Thể loại</Menu.Item>
                    <Menu.Item onClick={() => navigate("/thanh-vien")}>Quản lý tài khoản</Menu.Item>
                    {isAdmin === 'false' && (
                        <>
                            <Menu.Item onClick={() => navigate("/thanh-vien/lich-su-doc-truyen")}>Lịch sử đọc truyện</Menu.Item>
                            <Menu.Item onClick={() => navigate("/thanh-vien/truyen-yeu-thich")}>Truyện yêu thích</Menu.Item>
                        </>
                    )}
                    <Menu.Item onClick={() => navigate("/thanh-vien/nap-tien")}>Nạp tiền tài khoản</Menu.Item>
                </Menu>
            </Drawer>

            < Outlet />
        </div >
    );
}

export default HomePageLayout;