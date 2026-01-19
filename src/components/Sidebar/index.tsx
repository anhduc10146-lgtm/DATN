import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Button, notification } from "antd";
import { Link } from "react-router-dom";
import {
    UserOutlined,
    BookOutlined,
    PieChartOutlined,
    AreaChartOutlined,
    UploadOutlined,
    EditOutlined,
    NotificationOutlined,
    PoweroffOutlined,
    HistoryOutlined,
    BankOutlined,
    SettingOutlined,
    ClockCircleOutlined,
    KeyOutlined,
    ArrowUpOutlined,
    RocketOutlined,
    TeamOutlined,
    BellOutlined,
    MoneyCollectOutlined,
    FileAddOutlined,
    AudioOutlined,
    ReadOutlined,
    TagOutlined,
    InfoCircleOutlined,
    AppstoreAddOutlined,
    HomeOutlined
} from "@ant-design/icons";
import s from './styles.module.scss'
import { GET, POST } from '../../api/baseAPI'

const { Sider } = Layout;

const Sidebar: React.FC<{ collapsed: boolean; onCollapse: () => void; setIsLoading: any; soLuongThongBao: any }> = ({
    collapsed,
    onCollapse,
    setIsLoading,
    soLuongThongBao
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
        <Sider className={s.display} collapsible collapsed={collapsed} theme="dark" style={{ height: "calc(100vh - 48px)" }} onCollapse={onCollapse} width={250} collapsedWidth={80}>
            <div style={{ padding: 16, textAlign: "center" }}>
                <Avatar size="large" src={anhDaiDien ? anhDaiDien : (process.env.REACT_APP_BUILD_MODE_FE === 'dev' ? (process.env.REACT_APP_FE_LOCAL + '/avatar_img.png') : (process.env.REACT_APP_FE_LIVE + '/avatar_img.png'))} />
                {!collapsed && (
                    <div style={{ marginTop: 10 }}>
                        <h6 className={s.h6}>Hi, {ten}</h6>
                        <Button color="danger" icon={<PoweroffOutlined style={{ color: 'white' }} />} variant="solid" onClick={handleLogout}>Đăng xuất</Button>
                    </div>
                )}
            </div>
            <Menu theme="dark" mode="inline" style={{ fontSize: "14px", padding: "8px 0", height: "calc(100vh - 237px)", overflowY: "auto" }} className="menu_1">
                {isAdmin === 'true' ?
                    (
                        <>
                            <Menu.SubMenu
                                key="quan-ly-tai-khoan"
                                icon={<SettingOutlined />}
                                title="Quản lý tài khoản"
                            >
                                <Menu.Item key="thong-tin-tai-khoan" icon={<UserOutlined style={{ color: "white" }} />}>
                                    <Link to="/quan-tri-vien/quan-ly-tai-khoan/thong-tin-tai-khoan">Thông tin tài khoản</Link>
                                </Menu.Item>
                                <Menu.Item key="doi-mat-khau" icon={<KeyOutlined />}>
                                    <Link to="/quan-tri-vien/quan-ly-tai-khoan/doi-mat-khau">Đổi mật khẩu</Link>
                                </Menu.Item>
                            </Menu.SubMenu>
                            <Menu.SubMenu
                                key="quan-ly-thanh-vien"
                                icon={<TeamOutlined />}
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        Quản lý thành viên
                                        {soLuongThongBao > 0 && (
                                            <span className="notification-bell">
                                                <BellOutlined />
                                            </span>
                                        )}
                                    </div>
                                }
                            >
                                <Menu.Item key="tai-khoan" icon={<UserOutlined />}>
                                    <Link to="/quan-tri-vien/quan-ly-thanh-vien/tai-khoan">Tài khoản</Link>
                                </Menu.Item>
                                <Menu.Item key="thong-bao" icon={<BellOutlined />}>
                                    <Link to="/quan-tri-vien/quan-ly-thanh-vien/thong-bao">
                                        Thông báo
                                        {soLuongThongBao > 0 && (
                                            <span className="notification-badge">{soLuongThongBao}</span>
                                        )}
                                    </Link>
                                </Menu.Item>
                            </Menu.SubMenu>

                            <Menu.SubMenu
                                key="quan-ly-truyen"
                                icon={<ReadOutlined />}
                                title="Quản lý truyện"
                            >
                                <Menu.Item key="tai-len-truyen" icon={<FileAddOutlined />}>
                                    <Link to="/quan-tri-vien/quan-ly-truyen/tai-len-truyen">Tải lên truyện</Link>
                                </Menu.Item>
                                <Menu.Item key="tai-len-voice" icon={<AudioOutlined />}>
                                    <Link to="/quan-tri-vien/quan-ly-truyen/tai-len-voice">Tải lên voice</Link>
                                </Menu.Item>
                                <Menu.Item key="trang-thai" icon={<TagOutlined />}>
                                    <Link to="/quan-tri-vien/quan-ly-truyen/trang-thai">Trạng thái</Link>
                                </Menu.Item>
                                <Menu.Item key="quan-ly-key" icon={<KeyOutlined />}>
                                    <Link to="/quan-tri-vien/quan-ly-truyen/quan-ly-key">Quản lý key</Link>
                                </Menu.Item>
                                <Menu.Item key="truyen-de-xuat" icon={<AppstoreAddOutlined />}>
                                    <Link to="/quan-tri-vien/quan-ly-truyen/truyen-de-xuat">Truyện đề xuất</Link>
                                </Menu.Item>
                            </Menu.SubMenu>
                        </>
                    ) : (
                        <>
                            <Menu.Item key="trang-chu" icon={<HomeOutlined />}>
                                <Link to="/">Trang chủ</Link>
                            </Menu.Item>

                            <Menu.Item key="thong-tin" icon={<UserOutlined />}>
                                <Link to="/thanh-vien/thong-tin">Thông tin tài khoản</Link>
                            </Menu.Item>

                            <Menu.Item key="doi-mat-khau" icon={<KeyOutlined />}>
                                <Link to="/thanh-vien/doi-mat-khau">Đổi mật khẩu</Link>
                            </Menu.Item>

                            <Menu.Item key="lich-su-doc-truyen" icon={<ClockCircleOutlined />}>
                                <Link to="/thanh-vien/lich-su-doc-truyen">Lịch sử đọc truyện</Link>
                            </Menu.Item>

                            <Menu.Item key="truyen-yeu-thich" icon={<ClockCircleOutlined />}>
                                <Link to="/thanh-vien/truyen-yeu-thich">Truyện yêu thích</Link>
                            </Menu.Item>

                            <Menu.Item key="nang-cap-tai-khoan" icon={<RocketOutlined />}>
                                <Link to="/thanh-vien/nang-cap-tai-khoan">Nâng cấp tài khoản</Link>
                            </Menu.Item>

                            <Menu.SubMenu
                                key="quan-ly-nap-tien"
                                icon={<SettingOutlined />}
                                title="Quản lý nạp tiền"
                            >
                                <Menu.Item key="nap-tien" icon={<BankOutlined />}>
                                    <Link to="/thanh-vien/quan-ly-nap-tien/nap-tien-tai-khoan">Nạp tiền tài khoản</Link>
                                </Menu.Item>
                                <Menu.Item key="lich-su" icon={<HistoryOutlined />}>
                                    <Link to="/thanh-vien/quan-ly-nap-tien/lich-su-giao-dich">Lịch sử giao dịch</Link>
                                </Menu.Item>
                            </Menu.SubMenu>

                            <Menu.Item key="de-xuat-truyen" icon={<EditOutlined />}>
                                <Link to="/thanh-vien/de-xuat-truyen">Đề xuất truyện</Link>
                            </Menu.Item>
                        </>
                    )}
            </Menu>
        </Sider>
    );
};

export default Sidebar;
