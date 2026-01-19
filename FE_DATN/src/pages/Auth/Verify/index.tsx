/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { LockOutlined, CloseCircleOutlined, LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { LoginFormPage, ProConfigProvider, ProFormText } from '@ant-design/pro-components'
import { Button, ConfigProvider, notification, Spin } from 'antd'
import vi_VN from 'antd/lib/locale/vi_VN'
import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import s from './styles.module.scss'
import { POST } from '../../../api/baseAPI'

const statusNone = "0"
const statusError = "1";
const statusVerify = "2";
const statusQtvVerify = "5";
const statusForgetPassword = "3";
const statusInputPassword = "4";

function Verify() {
    const { id, token } = useParams<{ id: any, token: any }>();
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState("0");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const formRef = useRef<any>();

    const handleSetNewPassword = () => {
        setStatus(statusInputPassword);
    }

    const handleConfirmNewPassword = async () => {
        try {
            var formData = new FormData();
            formData.append("matKhau", formRef.current.getFieldsValue().matKhau);
            formData.append("token", token);
            formData.append("_id", id);

            setIsLoading(true)

            const req = await POST('api/authenticate/lay_lai_mat_khau', formData);
            setIsLoading(false);

            if (req.status === 200) {
                notification.success({
                    message: req.data.message,
                    description: req.data.content.message,
                    duration: 3,
                });
            }
            else {
                notification.error({
                    message: req.data.message,
                    description: req.data.content,
                    duration: 3,
                });
            }

            setTimeout(() => {
                window.location.href = "/login";
            }, 3000);
        }
        catch (error) {
            setError("Lỗi không xác định! Vui lòng liên hệ quản trị viên.")
            setIsLoading(false)
        }
    };

    const handleXacThuc = async () => {
        try {
            var formData = new FormData();

            formData.append("_id", id);
            formData.append("token", token);

            const req = await POST('api/authenticate/xac_thuc_token', formData);
            console.log(req);
            if (req.status !== 200) {
                setError(req.data.content)
            }
            else {
                setMessage(req.data.content.message);
                setName(req.data.content.ten)
                if (req.data.content.status === 0) {
                    setStatus(statusForgetPassword);
                }
                if (req.data.content.status === 1) {
                    setStatus(statusVerify);
                }
                if (req.data.content.status === 2) {
                    setStatus(statusQtvVerify)
                }
            }
            setIsLoading(false)
        }
        catch (error) {
            setError("Lỗi không xác định! Vui lòng liên hệ quản trị viên.")
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id && token) {
            handleXacThuc()
        }
    }, [id])

    useEffect(() => {
        if (error !== "") {
            setStatus(statusError);
        }
    }, [error])

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
                            subTitle={status !== statusInputPassword ? (status === statusQtvVerify ? `Xác thực quản trị viên ${name}` : `Xác thực thành viên ${status !== statusNone ? name : ''}`) : `Cập nhật mật khẩu mới`}
                            submitter={{
                                render: (props, dom) => {
                                    return (
                                        <div
                                            className={(status !== statusNone && status !== statusError) ? s.submitter_2 : s.submitter_1}
                                        >
                                            <Button
                                                type="default"
                                                onClick={() => {
                                                    window.location.href = "/";
                                                }}
                                            >
                                                Quay về trang chủ
                                            </Button>

                                            {status === statusVerify && (
                                                <Button
                                                    type="primary"
                                                    onClick={() => {
                                                        window.location.href = "/login";
                                                    }}
                                                >
                                                    Đăng nhập ngay
                                                </Button>
                                            )}

                                            {(status === statusForgetPassword || status === statusQtvVerify) && (
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleSetNewPassword()}
                                                >
                                                    Cập nhật mật khẩu mới
                                                </Button>
                                            )}

                                            {status === statusInputPassword && (
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleConfirmNewPassword()}
                                                >
                                                    Xác nhận
                                                </Button>
                                            )}

                                        </div>
                                    );
                                }
                            }}
                            style={{ minHeight: '100vh' }}
                        >
                            <div className={status !== statusInputPassword ? s.verify_form_body : ''}>
                                {status === statusError && (
                                    <>
                                        <h1 className={s.error_title}>Xác thực email thất bại</h1>
                                        <CloseCircleOutlined className={s.error_icon} />
                                        <h2 className={s.error_message}>{error}</h2>
                                    </>
                                )}

                                {status === statusVerify && (
                                    <>
                                        <h1 className={s.success_title}>Xác thực email thành công</h1>
                                        <CheckCircleOutlined className={s.success_icon} />
                                        <h2 className={s.success_message}>{message}</h2>
                                    </>
                                )}

                                {(status === statusForgetPassword || status === statusQtvVerify) && (
                                    <>
                                        <h1 className={s.success_title}>Xác thực email thành công</h1>
                                        <CheckCircleOutlined className={s.success_icon} />
                                        <h2 className={s.success_message}>{message.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}</h2>
                                    </>
                                )}

                                {status === statusInputPassword && (
                                    <>
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
                                                    message: 'Vui lòng nhập mật khẩu mới của bạn!',
                                                },
                                                {
                                                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                                                    message: 'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt!',
                                                },
                                            ]}
                                        />
                                        <ProFormText.Password
                                            name="nhapLaiMatKhau"
                                            dependencies={['matKhau']}
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
                                            placeholder={'Nhập lại mật khẩu'}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập lại mật khẩu của bạn!',
                                                },
                                                {
                                                    validator: async (_, value) => {
                                                        if (value !== formRef.current?.getFieldValue('matKhau')) {
                                                            return Promise.reject(
                                                                new Error('Mật khẩu nhập lại không khớp!')
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                        />
                                    </>
                                )}
                            </div>
                        </LoginFormPage>
                    </div>
                </ProConfigProvider >
            </ConfigProvider >
        </div >
    );
};

export default Verify;
