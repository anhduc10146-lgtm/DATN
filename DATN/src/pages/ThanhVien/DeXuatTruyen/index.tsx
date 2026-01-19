/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Upload, message, Row, Col, Select, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import s from "./styles.module.scss";
import { POST, POST_FILE } from "../../../api/baseAPI";

const DeXuatTruyen = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
    const [form] = Form.useForm();
    const [listTheLoai, setListTheLoai] = useState([]);
    const [seletedTheLoai, setSelectedTheLoai] = useState<any>([]);
    const [anhBia, setAnhBia] = useState<any>(null);

    const DanhSachTheLoai = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("page", "1");
            formData.append("pageSize", "1000");
            const response = await POST('api/homepage/quan_ly_truyen/danh_sach_the_loai', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                setListTheLoai(response?.data?.content);
            }
            setIsLoading(false);
        } catch (error) {
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách thể loại`,
                duration: 3,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            console.log("Submitted values:", values);
            console.log(anhBia);
            if (anhBia === null || anhBia === undefined) {
                notification.error({
                    message: 'Hệ thống',
                    description: "Vui lòng chọn ít nhất 1 thể loại",
                    duration: 3,
                });
                return;
            }

            setIsLoading(true);
            var formData = new FormData();
            formData.append("ten", values.ten);
            formData.append("tomTat", values.tomTat);
            formData.append("tacGia", values.tacGia);
            formData.append("link", values.link);
            seletedTheLoai.forEach((theLoai: any) => formData.append("theLoai", theLoai));
            formData.append("trangBia", anhBia);

            const res = await POST_FILE('api/member/quan_ly_truyen/de_xuat_truyen', formData);

            if (res?.status === 200) {
                notification.success({
                    message: res?.data?.message,
                    description: res?.data?.content,
                    showProgress: true,
                    duration: 3,
                });
                setIsLoading(false);
                setTimeout(() => {
                    window.location.href = '/thanh-vien/de-xuat-truyen';
                }, 3000);
            }
            else {
                setIsLoading(false);
                notification.error({
                    message: 'Hệ thống',
                    description: res?.data?.content,
                    duration: 3,
                });
            }
            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi tải lên bộ truyện`,
                duration: 3,
            });
        }
    };

    const handleChangeTheLoai = (value: any) => {
        setSelectedTheLoai(value);
    };

    const handleBeforeUpload = (file: File) => {
        return false;
    };

    const handleChangeUpload_2 = (info: any) => {
        const { fileList } = info;
        setAnhBia(fileList[0]?.originFileObj);
    };

    useEffect(() => {
        DanhSachTheLoai()
    }, [])

    return (
        <div style={{ padding: "20px" }}>
            <h1 className={s.title} style={{ textAlign: "center", marginBottom: "20px" }}>
                ĐỀ XUẤT TRUYỆN
            </h1>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: "100%", margin: "0 auto" }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            name="ten"
                            rules={[{ required: true, message: "Vui lòng nhập tên truyện! Nếu không có thì nhập không có." }]}
                        >
                            <Input placeholder="Nhập tên truyện" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            name="tacGia"
                            rules={[{ required: true, message: "Vui lòng nhập tên tác giả! Nếu không có thì nhập không có." }]}
                        >
                            <Input placeholder="Nhập tên tác giả" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            name="theLoai"
                            rules={[{ required: true, message: "Vui lòng nhập thể loại!" }]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Chọn thể loại"
                                onChange={handleChangeTheLoai}
                                options={listTheLoai?.map((item: any) => ({
                                    label: item.ten,
                                    value: item.id
                                }))}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            name="link"
                            rules={[{ required: true, message: "Vui lòng nhập link truyện! Nếu không có thì nhập không có." }]}
                        >
                            <Input placeholder="Nhập link truyện" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Form.Item
                            name="tomTat"
                            rules={[{ required: true, message: "Vui lòng nhập tóm tắt! Nếu không có thì nhập không có" }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập tóm tắt truyện" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Form.Item
                            name="trangBia"
                            valuePropName="file"
                            rules={[{ required: true, message: "Vui lòng tải lên trang bìa!" }]}
                        >
                            <Upload
                                multiple={false}
                                maxCount={1}
                                accept="image/*"
                                listType="picture-card"
                                showUploadList={{ showPreviewIcon: false }}
                                onPreview={() => false}
                                beforeUpload={handleBeforeUpload}
                                onChange={handleChangeUpload_2}
                                className="upload_1"
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh bìa</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="center">
                    <Col>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "150px" }}>
                                Đề xuất
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default DeXuatTruyen;
