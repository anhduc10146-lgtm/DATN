/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { LockOutlined, UserOutlined, PhoneOutlined, ManOutlined, CalendarOutlined, LoadingOutlined, FormOutlined } from '@ant-design/icons'
import { LoginFormPage, ProConfigProvider, ProFormUploadButton, ProFormDatePicker, ProFormText, ProFormSelect } from '@ant-design/pro-components'
import { Button, ConfigProvider, FormInstance, message, notification, Spin } from 'antd'
import vi_VN from 'antd/lib/locale/vi_VN'
import React, { useState, useRef } from 'react'
import s from './styles.module.scss'
import { POST_FILE } from '../../../api/baseAPI'

function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<FormInstance>();
    const [file, setFile] = useState<File | null>(null);

    const handleRegister = async (values: any) => {
        var formData = new FormData();

        formData.append("taiKhoan", values.taiKhoan);
        formData.append("matKhau", values.matKhau);
        formData.append("ten", values.ten);
        formData.append("soDienThoai", values.soDienThoai);
        formData.append("ngaySinh", values.ngaySinh);
        formData.append("diaChi", values.diaChi);
        formData.append("gioiTinh", values.gioiTinh);

        if (file) {
            formData.append("anhDaiDien", file);
        } else {
            notification.error({
                message: 'Đăng ký thất bại',
                description: 'Lỗi file ảnh đại diện, vui lòng tải lại file',
                duration: 3,
            });
            return;
        }

        setIsLoading(true)

        try {
            const res = await POST_FILE('api/authenticate/dang_ky', formData);

            setIsLoading(false);

            if (res.status !== 200) {
                notification.error({
                    message: res.data.message,
                    description: res.data.content,
                    duration: 5,
                });
            }
            if (res.status === 200) {
                notification.success({
                    message: res.data.message,
                    description: res.data.content,
                    duration: 3,
                });
                window.location.href = "/login";
            }
        }
        catch (err) {
            setIsLoading(false);
            notification.error({
                message: 'Đăng ký thất bại',
                description: 'Lỗi không xác định, liên hệ quản trị viên.',
                duration: 3,
            });
        }
    };

    return (
        <ConfigProvider locale={vi_VN}>
            <div className={s.register_page}>
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
                            formRef={formRef}
                            backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                            logo="/logo_web_no_text.png"
                            backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
                            title="Web truyện 2601"
                            containerStyle={{
                                backgroundColor: 'rgba(0, 0, 0,0.65)',
                                backdropFilter: 'blur(4px)',
                            }}
                            subTitle="Đăng ký trở thành thành viên của web"
                            onFinish={handleRegister}
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
                                                    window.location.href = "/";
                                                }}
                                            >
                                                Quay về trang chủ
                                            </Button>

                                            <Button
                                                type="primary"
                                                onClick={() => props.submit()}
                                            >
                                                Đăng ký
                                            </Button>
                                        </div>
                                    );
                                }
                            }}
                            style={{ minHeight: '100vh' }}
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
                                    {
                                        type: 'email',
                                        message: 'Vui lòng nhập đúng định dạng email!',
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                        message: 'Vui lòng sử dụng email đuôi @gmail.com!',
                                    }
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
                            <ProFormText
                                name="ten"
                                fieldProps={{
                                    size: 'large',
                                    prefix: (
                                        <FormOutlined
                                            style={{
                                                color: 'white',
                                            }}
                                            className={'prefixIcon'}
                                        />
                                    ),
                                }}
                                placeholder={'Họ và tên'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên của bạn!',
                                    },
                                ]}
                            />

                            <ProFormText
                                name="soDienThoai"
                                fieldProps={{
                                    size: 'large',
                                    prefix: (
                                        <PhoneOutlined
                                            style={{
                                                color: 'white',
                                            }}
                                            className={'prefixIcon'}
                                        />
                                    ),
                                }}
                                placeholder={'Số điện thoại'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại của bạn!',
                                    },
                                    {
                                        pattern: /^0[3|5|7|8|9][0-9]{8,9}$/,
                                        message: 'Số điện thoại không hợp lệ! Số điện thoại phải bắt đầu bằng 0 và đúng định dạng.',
                                    },
                                ]}
                            />
                            <ProFormSelect
                                name="gioiTinh"
                                fieldProps={{
                                    size: 'large',
                                    prefix: (
                                        <ManOutlined
                                            style={{
                                                color: 'white',
                                            }}
                                            className={'prefixIcon'}
                                        />
                                    ),
                                }}
                                placeholder="Chọn giới tính"
                                options={[
                                    { label: 'Nam', value: '1' },
                                    { label: 'Nữ', value: '0' },
                                    { label: 'Khác', value: '2' },
                                ]}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn giới tính!',
                                    },
                                ]}
                            />
                            <ProFormText
                                name="diaChi"
                                fieldProps={{
                                    size: 'large',
                                    prefix: (
                                        <FormOutlined
                                            style={{
                                                color: 'white',
                                            }}
                                            className={'prefixIcon'}
                                        />
                                    ),
                                }}
                                placeholder={'Địa chỉ'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập địa chỉ!',
                                    },
                                ]}
                            />
                            <ProFormDatePicker
                                name="ngaySinh"
                                fieldProps={{
                                    size: 'large',
                                    prefix: (
                                        <CalendarOutlined
                                            style={{
                                                color: 'white',
                                            }}
                                            className={'prefixIcon'}
                                        />
                                    )
                                }}
                                placeholder="Chọn ngày sinh"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ngày sinh!',
                                    },
                                ]}
                            />

                            <ProFormUploadButton
                                name="anhDaiDien"
                                title="Nhấn để tải lên"
                                max={1}
                                fieldProps={{
                                    accept: 'image/*',
                                    listType: 'picture-card',
                                    showUploadList: { showPreviewIcon: false },
                                    onPreview: () => false,
                                    beforeUpload: (file) => {
                                        setFile(file);
                                        return false;
                                    },
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng tải lên ảnh đại diện!',
                                    },
                                ]}
                            />

                        </LoginFormPage>
                    </div>
                </ProConfigProvider >

            </div>
        </ConfigProvider>
    );
};

export default Register;
