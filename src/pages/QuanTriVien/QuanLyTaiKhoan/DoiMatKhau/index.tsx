/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Select, InputNumber, notification, QRCode, Card, Form, Input } from "antd";
import s from './styles.module.scss'
import { GET, POST } from '../../../../api/baseAPI';

const DoiMatKhau = ({ setIsLoading }: { setIsLoading: any }) => {
    const [form] = Form.useForm();

    const handleUpdate = () => {
        form.validateFields()
            .then(async (values) => {
                var formData = new FormData();
                formData.append("matKhauCu", values.matKhauCu);
                formData.append("matKhauMoi", values.matKhauMoi);
                setIsLoading(true);
                const res = await POST('api/admin/quan_ly_thong_tin/doi_mat_khau', formData);
                setIsLoading(false);
                if (res?.status === 200) {
                    notification.success({
                        message: 'Hệ thống',
                        description: res?.data?.content,
                        showProgress: true,
                        duration: 3,
                    });

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
                else {
                    notification.error({
                        message: 'Hệ thống',
                        description: res?.data?.content,
                        duration: 3,
                    });
                }
            })
            .catch((error) => {
                notification.error({
                    message: 'Hệ thống',
                    description: 'Có lỗi xảy ra khi đổi mật khẩu',
                    duration: 3,
                });
            });
    };
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f2f5" }}>
            <h1 className={s.title} style={{ marginBottom: 24 }}>ĐỔI MẬT KHẨU</h1>

            <Card style={{ width: 400 }}>

                <Form form={form} layout="vertical" autoComplete="off">
                    <label style={{ fontWeight: "500", fontSize: "16px", marginBottom: "8px", marginTop: "0px", padding: "0", display: "block", textAlign: "left" }}>Mật khẩu cũ</label>
                    <Form.Item
                        name="matKhauCu"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu cũ" />
                    </Form.Item>
                    <label style={{ fontWeight: "500", fontSize: "16px", marginBottom: "8px", marginTop: "0px", padding: "0", display: "block", textAlign: "left" }}>Mật khẩu mới</label>
                    <Form.Item
                        name="matKhauMoi"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                            // {
                            //     pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                            //     message: 'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt!',
                            // },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                    <label style={{ fontWeight: "500", fontSize: "16px", marginBottom: "8px", marginTop: "0px", padding: "0", display: "block", textAlign: "left" }}>Nhập lại mật khẩu mới</label>
                    <Form.Item
                        name="nhapLaiMatKhau"
                        dependencies={['matKhauMoi']}
                        rules={[
                            { required: true, message: "Vui lòng nhập lại mật khẩu mới!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("matKhauMoi") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={handleUpdate} block>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default DoiMatKhau;