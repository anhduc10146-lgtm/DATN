/* eslint-disable jsx-a11y/anchor-is-valid */
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginFormPage, ProConfigProvider, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { Button, Divider, Space, notification, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { POST } from '../../../api/baseAPI'
import s from './styles.module.scss'
import { useState } from 'react'


function Login({ isAuthenticated, setIsAuthenticated }: { isAuthenticated: any, setIsAuthenticated: any }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (values: any) => {
        setIsLoading(true);

        var formData = new FormData();
        formData.append("taiKhoan", values.taiKhoan)
        formData.append("matKhau", values.matKhau)
        formData.append("isAdmin", values?.isAdmin ? "1" : "0")

        try {
            const data = await POST('api/authenticate/dang_nhap', formData);

            setIsLoading(false);

            if (data?.status === 200) {
                notification.success({
                    message: 'Đăng nhập thành công',
                    description: `Chào mừng ${values?.isAdmin ? 'quản trị viên' : 'thành viên'} ${data?.data?.content?.ten}`,
                    duration: 3,
                });
                localStorage.setItem('access_token', data?.data?.content?.token);
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("ten", data?.data?.content?.ten);
                localStorage.setItem("anhDaiDien", data?.data?.content?.anhDaiDien);
                setIsAuthenticated('true');

                setTimeout(() => {
                    if (values?.isAdmin) {
                        localStorage.setItem('isAdmin', 'true');
                        navigate('/quan-tri-vien');
                    }
                    else {
                        localStorage.setItem('isAdmin', 'false');
                        navigate('/thanh-vien');
                    }
                }, 3000);
            }
            else {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: `${data?.data?.content}`,
                    duration: 3,
                });
            }
        } catch (error) {
            setIsLoading(false);

            notification.error({
                message: 'Đăng nhập thất bại',
                description: 'Đã xảy ra lỗi, vui lòng thử lại!',
                duration: 3,
            });
        }
    };


    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className={s.login_page}>
            {isLoading && (
                <div className={s.overlay}>
                    <Spin
                        indicator={<LoadingOutlined style={{ fontSize: 48, color: '#fff' }} spin />}
                    />
                </div>
            )}

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
                        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                        logo="/logo_web_no_text.png"
                        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
                        title="Web truyện 2601"
                        containerStyle={{
                            backgroundColor: 'rgba(0, 0, 0,0.65)',
                            backdropFilter: 'blur(4px)',
                        }}
                        subTitle="Web đọc truyện được tạo bởi Phạm Việt Hoàng"
                        actions={
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                }}
                            >
                                <Divider plain>
                                    <span
                                        style={{
                                            fontWeight: 'normal',
                                            fontSize: 14,
                                            color: "FFFFFFA6"
                                        }}
                                    >
                                        Bạn chưa có tài khoản
                                    </span>
                                </Divider>
                                <Space align="center" size={24}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Button
                                            color="danger"
                                            variant="solid"
                                            onClick={handleRegisterClick}

                                        >
                                            Đăng ký ngay
                                        </Button>
                                    </div>
                                </Space>
                            </div>
                        }
                        onFinish={handleLogin}
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
                                            color="default"
                                            onClick={() => {
                                                window.location.href = "/";
                                            }}
                                        >
                                            Quay về trang chủ
                                        </Button>
                                        <Button
                                            type="primary"
                                            onClick={() => props.submit()}
                                        >
                                            Đăng nhập
                                        </Button>
                                    </div>
                                );
                            }
                        }}

                    >
                        <>
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
                            <ProFormText.Password
                                name="matKhau"
                                fieldProps={{
                                    size: 'large',
                                    prefix: (
                                        <LockOutlined
                                            style={{
                                                color: 'white',
                                            }}
                                            className={'prefixIcon'}
                                        />
                                    ),
                                }}
                                placeholder={'Mật khẩu'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu của bạn!',
                                    },
                                ]}
                            />
                        </>
                        <div
                            style={{
                                marginBlockEnd: 24,
                            }}
                        >
                            <ProFormCheckbox noStyle name="isAdmin">
                                Đăng nhập với quyền là admin
                            </ProFormCheckbox>
                            <a
                                style={{
                                    float: 'right',
                                }}
                                href='/forget-password'
                            >
                                Quên mật khẩu?
                            </a>
                        </div>
                    </LoginFormPage>
                </div>
            </ProConfigProvider >
        </div>
    );
};

export default Login;
