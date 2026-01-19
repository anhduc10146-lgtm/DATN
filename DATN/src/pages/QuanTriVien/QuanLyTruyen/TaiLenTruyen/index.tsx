/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Select, notification, Form, Upload, Input, Radio, Spin, Typography, SelectProps, Checkbox } from "antd";
import s from './styles.module.scss'
import { GET, POST, POST_FILE } from '../../../../api/baseAPI';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import { TotpMultiFactorGenerator } from 'firebase/auth';

const { Option } = Select;

const TaiLenTruyen = ({ setIsLoading }: { setIsLoading: any }) => {
    const navigate = useNavigate();
    const [uploadMode, setUploadMode] = useState("existing");
    const handleUploadModeChange = (e: any) => {
        setUploadMode(e.target.value);
    };

    //Tải lên tập truyện
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<any>([]);
    const [listChap, setListChap] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1000);
    const [selectedBoTruyen, setSelectedBoTruyen] = useState<any>(null);
    const [selectedTapTruyen, setSelectedTapTruyen] = useState<any>(null);
    const [listFile, setListFile] = useState<any>([]);
    const [tomTat, setTomTat] = useState("");
    const [charCount, setCharCount] = useState(0);

    const handleChangeTomTat = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
        setTomTat(e.target.value);
    };

    const DanhSachBoTruyen = async () => {
        setLoading(true);
        try {
            var formData = new FormData();
            formData.append("ten", "");
            formData.append("page", String(page));
            formData.append("pageSize", String(pageSize));
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_bo_truyen_2', formData);
            setLoading(false);
            if (response?.status === 200) {
                setOptions(response?.data?.content);
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

    const DanhSachTapTruyenMoi = async (_id: any) => {
        if (!_id) {
            setOptions([]);
            return;
        }
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("_idBoTruyen", String(_id));
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_tap_truyen_moi', formData);
            setLoading(false);
            if (response?.status === 200) {
                setListChap(response.data.content);
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
        setSelectedTapTruyen(null);
        setSelectedBoTruyen(value);
    };

    const handleChangeTapTruyen = (value: any) => {
        setSelectedTapTruyen(value);
    };

    const handleBeforeUpload = (file: File) => {
        return false;
    };

    const handleChangeUpload = (info: any) => {
        const { fileList } = info;
        setListFile(fileList.map((item: any) => item.originFileObj));
    };

    const handleUploadTapTruyenMoi = async () => {
        try {
            if (selectedTapTruyen == null) {
                notification.error({
                    message: 'Hệ thống',
                    description: "Vui lòng chọn lại tập truyện mỗi khi chọn bộ truyện",
                    duration: 3,
                });
                return;
            }

            if (listFile.length > 0) {
                setIsLoading(true);
                var formData = new FormData();
                formData.append("_idBoTruyen", selectedBoTruyen);
                formData.append("tapSo", selectedTapTruyen);
                formData.append("tomTat", tomTat);
                listFile.forEach((file: any, index: any) => {
                    formData.append("listFile", file);
                });
                const res = await POST_FILE('api/admin/quan_ly_truyen/tai_len_tap_moi', formData);

                if (res?.status === 200) {
                    notification.success({
                        message: res?.data?.message,
                        description: res?.data?.content,
                        showProgress: true,
                        duration: 3,
                    });
                    setTimeout(() => {
                        window.location.href = '/quan-tri-vien/quan-ly-truyen/trang-thai';
                    }, 3000);
                }
                else {
                    notification.error({
                        message: 'Hệ thống',
                        description: res?.data?.content,
                        duration: 3,
                    });
                }
            }
            else {
                notification.error({
                    message: 'Hệ thống',
                    description: `Cần tải lên ít nhất 1 trang`,
                    duration: 3,
                });
            }

            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi tải lên tập truyện`,
                duration: 3,
            });
        }
    }

    useEffect(() => {
        DanhSachBoTruyen();
    }, [])

    useEffect(() => {
        if (selectedBoTruyen) {
            setListChap([]);
            DanhSachTapTruyenMoi(selectedBoTruyen);
        }
    }, [selectedBoTruyen])

    //Tải lên bộ truyện mới
    const [ten, setTen] = useState("");
    const [tomTat_1, setTomTat_1] = useState("");
    const [gioiHanLuaTuoi, setGioiHanLuaTuoi] = useState(0);
    const [tacGia, setTacGia] = useState("");
    const [listTheLoai, setListTheLoai] = useState([]);
    const [seletedTheLoai, setSelectedTheLoai] = useState<any>([]);
    const [listFile_1, setListFile_1] = useState<any>([]);
    const [anhBia, setAnhBia] = useState<any>(null);
    const [checked, setChecked] = useState(0);
    const [giaBanQuyen, setGiaBanQuyen] = useState(0);

    const handleChangeGioiQuyenDoc = (e: any) => {
        setChecked(e.target.checked ? 1 : 0);
    };

    const DanhSachTheLoai = async () => {
        setLoading(true);
        try {
            var formData = new FormData();
            formData.append("page", "1");
            formData.append("pageSize", "1000");
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_the_loai', formData);
            setLoading(false);
            if (response?.status === 200) {
                setListTheLoai(response?.data?.content);
            }
            setLoading(false);
        } catch (error) {
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách thể loại`,
                duration: 3,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangeTen = (e: any) => {
        setTen(e.target.value);
    };

    const handleChangeTomTat_1 = (e: any) => {
        setTomTat_1(e.target.value);
    };

    const handleChangeTacGia = (e: any) => {
        setTacGia(e.target.value);
    };

    const handleChangeGioiHanLuaTuoi = (e: any) => {
        setGioiHanLuaTuoi(e.target.value);
    };

    const handleChangeTheLoai = (value: any) => {
        setSelectedTheLoai(value);
    };

    const handleChangeUpload_1 = (info: any) => {
        const { fileList } = info;
        setListFile_1(fileList?.map((item: any) => item.originFileObj));
    };

    const handleChangeUpload_2 = (info: any) => {
        const { fileList } = info;
        setAnhBia(fileList[0]?.originFileObj);
    };

    const handleChangeGiaBanQuyen = (e: any) => {
        setGiaBanQuyen(e.target.value)
    }

    const handleUploadBoTruyenMoi = async () => {
        try {
            if (seletedTheLoai.length === 0) {
                notification.error({
                    message: 'Hệ thống',
                    description: "Vui lòng chọn ít nhất 1 thể loại",
                    duration: 3,
                });
                return;
            }

            if (anhBia === null || anhBia === undefined) {
                notification.error({
                    message: 'Hệ thống',
                    description: "Vui lòng chọn ít nhất 1 thể loại",
                    duration: 3,
                });
                return;
            }

            if (listFile_1.length > 0) {
                setIsLoading(true);
                var formData = new FormData();
                formData.append("ten", ten);
                formData.append("tomTat", tomTat_1);
                formData.append("tacGia", tacGia);
                seletedTheLoai.forEach((theLoai: any) => formData.append("theLoai", theLoai));
                formData.append("gioiHanLuaTuoi", String(gioiHanLuaTuoi));
                formData.append("gioiHanQuyenDoc", String(checked));
                formData.append("giaBanQuyen", String(giaBanQuyen));
                formData.append("trangBia", anhBia);
                listFile_1.forEach((file: any, index: any) => formData.append("tapTruyen", file));

                const res = await POST_FILE('api/admin/quan_ly_truyen/tao_truyen_moi', formData);

                if (res?.status === 200) {
                    notification.success({
                        message: res?.data?.message,
                        description: res?.data?.content,
                        showProgress: true,
                        duration: 3,
                    });
                    setIsLoading(false);
                    setTimeout(() => {
                        window.location.href = '/quan-tri-vien/quan-ly-truyen/trang-thai';
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
            }
            else {
                notification.error({
                    message: 'Hệ thống',
                    description: `Cần tải lên ít nhất 1 trang cho tập đầu tiên`,
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
    }

    useEffect(() => {
        if (uploadMode === "new")
            DanhSachTheLoai()
    }, [uploadMode])
    return (
        <div className={s.personalInfoContainer} style={{ padding: "20px" }}>
            <h1>TẢI LÊN TRUYỆN</h1>
            <Radio.Group onChange={handleUploadModeChange} value={uploadMode}>
                <Radio value="existing">Tải lên tập truyện</Radio>
                <Radio value="new">Tải lên bộ truyện mới</Radio>
            </Radio.Group>

            {
                uploadMode === "existing" && (
                    <Form layout="vertical" style={{ marginTop: "20px" }} onFinish={handleUploadTapTruyenMoi}>
                        <Form.Item
                            label="Chọn bộ truyện"
                            name="_idBoTruyen"
                            rules={[
                                { required: true, message: "Vui lòng chọn bộ truyện!" },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn bộ truyện"
                                notFoundContent={loading ? <Spin size="small" /> : "No data"}
                                // onSearch={handleSearchBoTruyen}
                                onChange={handleChangeBoTruyen}
                                filterOption={(input: any, option: any) => {
                                    // Kiểm tra nếu tên bộ truyện chứa từ tìm kiếm
                                    return option?.children.toLowerCase().includes(input.toLowerCase());
                                }}
                                style={{ width: '100%', textAlign: 'left' }}
                            >
                                {options?.map((option: any, index: any) => (
                                    <Option key={index} value={option._id}>
                                        {option.ten}
                                    </Option>
                                )) || []}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Tập số ( Lưu ý chỉ có thể tải lên tập mới nhất hoặc tập cũ nhưng bị xóa )"
                            name="tapSo"
                            rules={[
                                { required: true, message: "Vui lòng chọn tập truyện!" },
                            ]}
                        >
                            <Select
                                showSearch
                                value={selectedTapTruyen}
                                placeholder="Chọn tập truyện"
                                notFoundContent={loading ? <Spin size="small" /> : "No data"}
                                onChange={handleChangeTapTruyen}
                                style={{ width: '100%', textAlign: 'left' }}
                            >
                                {listChap?.map((tap: any, index: any) => (
                                    <Option key={index} value={tap}>
                                        {tap}
                                    </Option>
                                )) || []}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Tóm tắt"
                        >
                            <TextArea
                                placeholder="Nhập tóm tắt ở đây"
                                maxLength={4500}
                                onChange={handleChangeTomTat}
                            />
                            <Typography.Text type="secondary">{charCount} ký tự / 4500 ký tự</Typography.Text>
                        </Form.Item>

                        <Form.Item
                            label="Tải các trang đặt tên từ 01.jpg --> xx.jpg"
                            name="files"
                            rules={[
                                { required: true, message: "Vui lòng tải lên ít nhất một ảnh!" },
                            ]}
                        >
                            <Upload
                                multiple={true}
                                accept="image/*"
                                listType="picture-card"
                                showUploadList={{ showPreviewIcon: false }}
                                onPreview={() => false}
                                beforeUpload={handleBeforeUpload}
                                onChange={handleChangeUpload}
                                className="upload_1"
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>

                        <Button type="primary" htmlType="submit">Tải lên</Button>
                    </Form>
                )
            }

            {
                uploadMode === "new" && (
                    <Form layout="vertical" style={{ marginTop: "20px" }} onFinish={handleUploadBoTruyenMoi}>
                        <Form.Item
                            label="Tên truyện"
                            name="ten"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên truyện!' }
                            ]}
                        >
                            <Input placeholder="Nhập tên truyện" onChange={handleChangeTen} />
                        </Form.Item>

                        <Form.Item
                            label="Tóm tắt"
                            name="tomTat"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tóm tắt truyện!' }
                            ]}
                        >
                            <Input.TextArea placeholder="Nhập tóm tắt" onChange={handleChangeTomTat_1} />
                        </Form.Item>

                        <Form.Item label="Tác giả">
                            <Input placeholder="Nhập tên tác giả" onChange={handleChangeTacGia} />
                        </Form.Item>

                        <Form.Item
                            label="Thể loại"
                            name="theLoai"
                            rules={[
                                { required: true, message: 'Vui lòng chọn thể loại!' }
                            ]}
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

                        <Form.Item
                            label="Giới hạn lứa tuổi"
                            name="gioiHanLuaTuoi"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giới hạn lứa tuổi nếu không có giới hạn thì nhập 0!' }
                            ]}
                        >
                            <Input placeholder="Nhập giới hạn lứa tuổi" type='number' onChange={handleChangeGioiHanLuaTuoi} />
                        </Form.Item>

                        <Form.Item>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px' }}>Giới hạn quyền đọc</span>
                                <Checkbox onChange={handleChangeGioiQuyenDoc} />
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Giá bản quyền (VNĐ)"
                            name="giaBanQuyen"
                        >
                            <Input defaultValue={0} onChange={handleChangeGiaBanQuyen} type='number' />
                        </Form.Item>

                        <Form.Item
                            label="Trang bìa"
                            name="trangBia"
                            rules={[
                                { required: true, message: 'Vui lòng tải lên trang bìa!' }
                            ]}>
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

                        <Form.Item
                            label="Tải các trang của tập đầu tiên đặt tên từ 01.jpg --> xx.jpg"
                            name="tapTruyen"
                            rules={[
                                { required: true, message: 'Vui lòng tải các trang đầu tiên của tập truyện!' }
                            ]}>
                            <Upload
                                multiple={true}
                                accept="image/*"
                                listType="picture-card"
                                showUploadList={{ showPreviewIcon: false }}
                                onPreview={() => false}
                                beforeUpload={handleBeforeUpload}
                                onChange={handleChangeUpload_1}
                                className="upload_1"
                            >
                                <Button icon={<UploadOutlined />}>Tải lên danh sách trang</Button>
                            </Upload>
                        </Form.Item>

                        <Button type="primary" htmlType='submit'>Tải lên</Button>
                    </Form>
                )
            }
        </div >
    );
}

export default TaiLenTruyen;