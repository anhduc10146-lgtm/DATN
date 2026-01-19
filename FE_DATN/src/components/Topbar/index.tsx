import { Header } from 'antd/es/layout/layout';
import s from './styles.module.scss'
import React from 'react';
import { Avatar, Button, Drawer, Menu, notification } from 'antd';
import { AppstoreAddOutlined, AudioOutlined, BankOutlined, BellOutlined, ClockCircleOutlined, EditOutlined, FileAddOutlined, HistoryOutlined, KeyOutlined, MenuOutlined, ReadOutlined, RocketOutlined, SettingOutlined, TagOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { POST } from '../../api/baseAPI';

const Topbar: React.FC<{ drawerVisible: boolean; toggleDrawer: () => void; setIsLoading: any }> = ({
    drawerVisible,
    toggleDrawer,
    setIsLoading
}) => {
    const anhDaiDien = localStorage.getItem('anhDaiDien');
    const ten = localStorage.getItem('ten');
    const isAdmin: any = localStorage.getItem('isAdmin') || 'false';

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
                    window.location.href = '/login';
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

    return (
        <div className={s.display}>
            <Header className={s.header}>
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

                <div className={s.userInfo}>
                    <Avatar style={{ marginBottom: '10px', height: ' 45px', width: '45px' }} src={anhDaiDien ? anhDaiDien : (process.env.REACT_APP_BUILD_MODE_FE === 'dev' ? (process.env.REACT_APP_FE_LOCAL + '/avatar_img.png') : (process.env.REACT_APP_FE_LIVE + '/avatar_img.png'))} alt="Avatar" />
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


                <Menu theme="light" mode="inline" style={{ fontSize: "14px", padding: "8px 0", height: "calc(100vh - 237px)", overflowY: "auto" }} className="menu_1">
                    {isAdmin === 'true' ?
                        (
                            <>
                                <Menu.SubMenu
                                    key="quan-ly-tai-khoan"
                                    icon={<SettingOutlined />}
                                    title="Quản lý tài khoản"
                                >
                                    <Menu.Item key="thong-tin-tai-khoan" icon={<UserOutlined style={{ color: "white" }} />} onClick={toggleDrawer}>
                                        <Link to="/quan-tri-vien/quan-ly-tai-khoan/thong-tin-tai-khoan">Thông tin tài khoản</Link>
                                    </Menu.Item>
                                    <Menu.Item key="doi-mat-khau" icon={<KeyOutlined />} onClick={toggleDrawer}>
                                        <Link to="/quan-tri-vien/quan-ly-tai-khoan/doi-mat-khau">Đổi mật khẩu</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="quan-ly-thanh-vien"
                                    icon={<TeamOutlined />}
                                    title="Quản lý thành viên"
                                >
                                    <Menu.Item key="tai-khoan" icon={<UserOutlined />} onClick={toggleDrawer}>
                                        <Link to="/quan-tri-vien/quan-ly-thanh-vien/tai-khoan">Tài khoản</Link>
                                    </Menu.Item>
                                    <Menu.Item key="thong-bao" icon={<BellOutlined />} onClick={toggleDrawer}>
                                        <Link to="/quan-tri-vien/quan-ly-thanh-vien/thong-bao">Thông báo</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>

                                <Menu.SubMenu
                                    key="quan-ly-truyen"
                                    icon={<ReadOutlined />}
                                    title="Quản lý truyện"
                                >
                                    <Menu.Item key="tai-len-truyen" icon={<FileAddOutlined />} onClick={toggleDrawer}>
                                        <Link to="/quan-tri-vien/quan-ly-truyen/tai-len-truyen">Tải lên truyện</Link>
                                    </Menu.Item>
                                    <Menu.Item key="tai-len-voice" icon={<AudioOutlined />} onClick={toggleDrawer}>
                                        <Link to="/quan-tri-vien/quan-ly-truyen/tai-len-voice">Tải lên voice</Link>
                                    </Menu.Item>
                                    <Menu.Item key="trang-thai" icon={<TagOutlined />} onClick={toggleDrawer}>
                                        <Link to="/quan-tri-vien/quan-ly-truyen/trang-thai">Trạng thái</Link>
                                    </Menu.Item>
                                    <Menu.Item key="quan-ly-key" icon={<KeyOutlined />} onClick={toggleDrawer}>
                                        <Link to="/quan-tri-vien/quan-ly-truyen/quan-ly-key">Quản lý key</Link>
                                    </Menu.Item>
                                    <Menu.Item key="truyen-de-xuat" icon={<AppstoreAddOutlined />} onClick={toggleDrawer}>
                                        <Link to="/quan-tri-vien/quan-ly-truyen/truyen-de-xuat">Truyện đề xuất</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>
                            </>
                        ) : (
                            <>
                                <Menu.Item key="thong-tin" icon={<UserOutlined />} onClick={toggleDrawer}>
                                    <Link to="/thanh-vien/thong-tin">Thông tin tài khoản</Link>
                                </Menu.Item>

                                <Menu.Item key="doi-mat-khau" icon={<KeyOutlined />} onClick={toggleDrawer}>
                                    <Link to="/thanh-vien/doi-mat-khau">Đổi mật khẩu</Link>
                                </Menu.Item>

                                <Menu.Item key="lich-su-doc-truyen" icon={<ClockCircleOutlined />} onClick={toggleDrawer}>
                                    <Link to="/thanh-vien/lich-su-doc-truyen">Lịch sử đọc truyện</Link>
                                </Menu.Item>

                                <Menu.Item key="truyen-yeu-thich" icon={<ClockCircleOutlined />} onClick={toggleDrawer}>
                                    <Link to="/thanh-vien/truyen-yeu-thich">Truyện yêu thích</Link>
                                </Menu.Item>

                                <Menu.Item key="nang-cap-tai-khoan" icon={<RocketOutlined />} onClick={toggleDrawer}>
                                    <Link to="/thanh-vien/nang-cap-tai-khoan">Nâng cấp tài khoản</Link>
                                </Menu.Item>

                                <Menu.SubMenu
                                    key="quan-ly-nap-tien"
                                    icon={<SettingOutlined />}
                                    title="Quản lý nạp tiền"
                                >
                                    <Menu.Item key="nap-tien" icon={<BankOutlined />} onClick={toggleDrawer}>
                                        <Link to="/thanh-vien/quan-ly-nap-tien/nap-tien-tai-khoan">Nạp tiền tài khoản</Link>
                                    </Menu.Item>
                                    <Menu.Item key="lich-su" icon={<HistoryOutlined />} onClick={toggleDrawer}>
                                        <Link to="/thanh-vien/quan-ly-nap-tien/lich-su-giao-dich">Lịch sử giao dịch</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>

                                <Menu.Item key="de-xuat-truyen" icon={<EditOutlined />} onClick={toggleDrawer}>
                                    <Link to="/thanh-vien/de-xuat-truyen">Đề xuất truyện</Link>
                                </Menu.Item>
                            </>
                        )}
                </Menu>
            </Drawer>
        </div>
    );
};

export default Topbar;