import React, { ReactElement, ReactNode, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { Avatar, Button, Drawer, Input, Menu, Spin } from 'antd';
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import s from './styles.module.scss'
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';

const DashboardLayout = ({
    isLoading,
    setIsLoading,
    soLuongThongBao
}: {
    isLoading: any,
    setIsLoading: any,
    soLuongThongBao: any
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    return (
        <div className={s.dashboard_page}>
            {isLoading && (
                <div className={s.overlay}>
                    <Spin
                        indicator={<LoadingOutlined style={{ fontSize: 48, color: '#fff' }} spin />}
                    />
                </div>
            )}
            <div className={s.dashboard_layout} >
                <Sidebar collapsed={collapsed} onCollapse={toggleSidebar} setIsLoading={setIsLoading} soLuongThongBao={soLuongThongBao} />

                <Topbar toggleDrawer={toggleDrawer} drawerVisible={drawerVisible} setIsLoading={setIsLoading} />

                <div className={s.dashboard_body}>
                    <div className={s.dashboard_body_child}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default DashboardLayout;