/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Select, InputNumber, notification, QRCode, Table, Modal, Form, Upload, Input, Radio, Slider, Spin, Typography } from "antd";
import s from './styles.module.scss'
import { GET, POST, POST_FILE } from '../../../../api/baseAPI';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

const TaiLenVoice = ({ setIsLoading }: { setIsLoading: any }) => {
    const [noiDung, setNoiDung] = useState("");
    const [keyVoice, setKeyVoice] = useState([]);
    const [tocDo, setTocDo] = useState(1);
    const [danhSachBoTruyen, setDanhSachBoTruyen] = useState<any>([]);
    const [danhSachTapTruyen, setDanhSachTapTruyen] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1000);
    const [loading, setLoading] = useState(false);
    const [idBoTruyen, setIdBoTruyen] = useState<any>("");
    const [idTapTruyen, setIdTapTruyen] = useState<any>(null);
    const [charCount, setCharCount] = useState(0);

    const handleChangeTomTat = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
        setNoiDung(e.target.value);
    };

    const handleSubmit = async (values: any) => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("ten", String(values.ten));
            formData.append("noiDung", String(values.noiDung));
            formData.append("keyVoice", String(values.keyVoice));
            formData.append("tocDo", String(tocDo));
            formData.append("maBoTruyen", String(idBoTruyen));

            if (idTapTruyen !== null) formData.append("idTapTruyen", String(idTapTruyen));

            const response = await POST('api/admin/quan_ly_truyen/tao_voice', formData);

            if (response?.status === 200) {
                notification.success({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
                setTimeout(() => {
                    window.location.href = '/quan-tri-vien/quan-ly-truyen/trang-thai';
                }, 3000);
            }
            else {
                setIsLoading(false);
                notification.error({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(true);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi tạo voice`,
                duration: 3,
            });
        };
    }

    const DanhSachKeyVoice = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("page", "1");
            formData.append("pageSize", "1000");
            formData.append("trangThai", "1");
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_key_voice', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                setKeyVoice(response?.data?.content);
            }
        }
        catch (error) {
            setIsLoading(false);
        }
    }

    const DanhSachBoTruyen = async () => {
        var formData = new FormData();
        setLoading(true);
        try {
            formData.append("ten", "");
            formData.append("page", String(page));
            formData.append("pageSize", String(pageSize));
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_bo_truyen_2', formData);
            setLoading(false);
            if (response?.status === 200) {
                setDanhSachBoTruyen(response?.data?.content);
            }
            setLoading(false);
        } catch (error) {
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách bộ truyện`,
                duration: 3,
            });
        } finally {
            setLoading(false);
        }
    };

    const DanhSachTapTruyenHienTai = async (_id: any) => {
        console.log(_id);
        if (!_id) {
            setDanhSachTapTruyen([]);
            return;
        }
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("idBoTruyen", String(idBoTruyen));
            formData.append("page", "1");
            formData.append("pageSize", "1000");
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_tap_truyen_hien_tai', formData);
            if (response?.status === 200) {
                setDanhSachTapTruyen(response.data.content);
            }
            setIsLoading(false);
        } catch (error) {
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách tập truyện`,
                duration: 3,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleChangeBoTruyen = (value: string) => {
        setIdTapTruyen(null);
        setIdBoTruyen(value);
    };

    const handleChangeTapTruyen = (value: any) => {
        setIdTapTruyen(value);
    };

    const handleChangeVoice = (value: any) => {
        setTocDo(value);
    }

    useEffect(() => {
        DanhSachKeyVoice();
        DanhSachBoTruyen();
    }, [])

    useEffect(() => {
        if (idBoTruyen) {
            setDanhSachTapTruyen([]);
            DanhSachTapTruyenHienTai(idBoTruyen);
        }
    }, [idBoTruyen])

    return (
        <div className={s.personalInfoContainer} style={{ padding: "20px" }}>
            <h1>TẢI LÊN VOICE</h1>

            <Form
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: "800px", margin: "0 auto" }}
            >
                <Form.Item
                    label="Tên"
                    name="ten"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                    <Input placeholder="Nhập tên" />
                </Form.Item>

                <Form.Item
                    label="Nội dung"
                    name="noiDung"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                >
                    <Input.TextArea
                        placeholder="Nhập nội dung"
                        maxLength={4500}
                        rows={5}
                        onChange={handleChangeTomTat}
                    />

                </Form.Item>
                <Typography.Text type="secondary">{charCount} ký tự / 4500 ký tự</Typography.Text>

                <Form.Item
                    label="KeyVoice"
                    name="keyVoice"
                    rules={[{ required: true, message: "Vui lòng chọn KeyVoice!" }]}
                >
                    <Select placeholder="Chọn KeyVoice">
                        {keyVoice?.map((item: any) => (
                            <Select.Option key={item.id} value={item.id}>
                                Key Voice {item.id}: {item.key} ({Number(item.soLuongKyTuConLai)})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Tốc độ"
                    name="tocDo"
                >
                    <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        defaultValue={1}
                        value={tocDo}
                        onChange={handleChangeVoice}
                    />
                </Form.Item>

                <Form.Item
                    label="Bộ truyện"
                    name="idBoTruyen"
                    rules={[{ required: true, message: "Vui lòng chọn Bộ truyện!" }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn bộ truyện"
                        onChange={handleChangeBoTruyen}
                        filterOption={(input: any, option: any) => {
                            // Kiểm tra nếu tên bộ truyện chứa từ tìm kiếm
                            return option?.children.toLowerCase().includes(input.toLowerCase());
                        }}
                        style={{ width: '100%', textAlign: 'left' }}
                    >
                        {danhSachBoTruyen?.map((option: any, index: any) => (
                            <Option key={index} value={option._id}>
                                {option.ten}
                            </Option>
                        )) || []}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Chọn tập truyện"
                    name="tapSo"
                >
                    <Select
                        showSearch
                        value={idTapTruyen}
                        placeholder="Chọn tập truyện"
                        notFoundContent={loading ? <Spin size="small" /> : "No data"}
                        onChange={handleChangeTapTruyen}
                        style={{ width: '100%', textAlign: 'left' }}
                    >
                        {danhSachTapTruyen?.map((data: any, index: any) => (
                            <Option key={index} value={data._id}>
                                {data.tap}
                            </Option>
                        )) || []}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Tạo voice
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );

}

export default TaiLenVoice;