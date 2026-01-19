/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { LoadingOutlined, UserOutlined } from '@ant-design/icons'
import { LoginFormPage, ProConfigProvider, ProFormText } from '@ant-design/pro-components'
import { Button, ConfigProvider, FormInstance, notification, Spin } from 'antd'
import vi_VN from 'antd/lib/locale/vi_VN'
import React, { useState, useRef } from 'react'
import s from './styles.module.scss'
import { POST } from '../../../api/baseAPI'

function ForgetPassword() {
    const formRef = useRef<FormInstance>();
    const [isLoading, setIsLoading] = useState(false);
    const handleForgetPassword = async (values: any) => {
        try {
            var formData = new FormData();
            formData.append("taiKhoan", values.taiKhoan);
            setIsLoading(true);
            const req = await POST('api/authenticate/quen_mat_khau', formData);
            setIsLoading(false);
            if (req.status === 200) {
                notification.success({
                    message: req.data.message,
                    description: req.data.content,
                    duration: 3,
                });
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
            }
            else {
                notification.error({
                    message: req.data.message,
                    description: req.data.content,
                    duration: 3,
                });
            }
        }
        catch (error) {
            notification.error({
                message: 'Quên mật khẩu',
                description: 'Lỗi hệ thống, vui lòng liên hệ quản trị viên',
                duration: 3,
            });
        }

    };

    return (
        <div className={s.verify_page}>
            {isLoading && (
                <div className={s.overlay}>
                    <Spin
                        indicator={<LoadingOutlined style={{ fontSize: 48, color: '#fff' }} spin />}
                    />
                </div>
            )}
            <ConfigProvider locale={vi_VN}>
                <ProConfigProvider dark>
                    <div
                        style={{
                            backgroundColor: 'white',
                            height: '100vh',
                            width: '100%'
                        }}
                        className='pro_config_provider_1'
                    >
                        <LoginFormPage
                            formRef={formRef}
                            backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                            logo="/logo_web_no_text.png"
                            backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
                            title="Web truyện 2601"
                            containerStyle={{
                                backgroundColor: 'rgba(0, 0, 0,0.65)',
                                backdropFilter: 'blur(4px)',
                            }}
                            subTitle="Vui lòng nhập tài khoản để lấy lại mật khẩu"
                            onFinish={handleForgetPassword}
                            submitter={{
                                render: (props, dom) => {
                                    return (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginTop: "16px",
                                                width: "100%"
                                            }}
                                        >
                                            <Button
                                                type="default"
                                                onClick={() => {
                                                    window.location.href = "/login";
                                                }}
                                            >
                                                Quay về trang đăng nhập
                                            </Button>

                                            <Button
                                                type="primary"
                                                onClick={() => props.submit()}
                                            >
                                                Lấy lại mật khẩu
                                            </Button>
                                        </div>
                                    );
                                }
                            }}
                            style={{ minHeight: '100vh', alignItems: 'center' }}
                        >
                            <ProFormText
                                name="taiKhoan"
                                fieldProps={{
                                    size: 'large',
                                    prefix: (
                                        <UserOutlined
                                            style={{
                                                color: 'white',
                                            }}
                                            className={'prefixIcon'}
                                        />
                                    ),
                                }}
                                placeholder={'Tài khoản'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tài khoản của bạn!',
                                    },
                                ]}
                            />
                        </LoginFormPage>
                    </div>
                </ProConfigProvider >
            </ConfigProvider>
        </div >
    );
};

export default ForgetPassword;
