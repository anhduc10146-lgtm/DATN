/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Button, Select, InputNumber, notification, Table, Modal, Col, Row, Input, DatePicker, Switch, Form } from "antd";
import s from './styles.module.scss'
import { POST_FILE, POST } from '../../../../api/baseAPI';
import { ColumnType } from 'antd/es/table';
import { CrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;
const { TextArea } = Input;

const ThongTinThanhVien = ({ setIsLoading }: { setIsLoading: any }) => {
    const navigate = useNavigate();
    const access_token = localStorage.getItem('access_token');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(1);

    const [onSearch, setOnSearch] = useState(0);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState([]);

    const [tenSearch, setTenSearch] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [trangThaiSearch, setTrangThaiSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    const [ten, setTen] = useState("");
    const [anhDaiDien, setAnhDaiDien] = useState<any>(null);
    const [ngaySinh, setNgaySinh] = useState("");
    const [gioiTinh, setGioiTinh] = useState("");
    const [diaChi, setDiaChi] = useState("");
    const [trangThai, setTrangThai] = useState(0);
    const [active, setActive] = useState(0);
    const [taiKhoan, setTaiKhoan] = useState("");
    const [email, setEmail] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [soDuTaiKhoan, setSoDuTaiKhoan] = useState("");

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear(); // Năm

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }

    const handleShowInfo = (member: any) => {

        setTen(member?.ten);
        setNgaySinh(member?.ngaySinh);
        setGioiTinh(member?.gioiTinh);
        setDiaChi(member?.diaChi);
        setTrangThai(member?.trangThai);
        setActive(member?.active);
        setTaiKhoan(member?.taiKhoan);
        setTrangThai(member?.trangThai);
        setEmail(member?.email);
        setSoDienThoai(member?.soDienThoai);
        setSoDuTaiKhoan(member?.soDuTaiKhoan);

        setSelectedMember(member);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {

        setTen("");
        setAnhDaiDien(null);
        setNgaySinh("");
        setGioiTinh("");
        setDiaChi("");
        setTrangThai(0);
        setActive(0);
        setTaiKhoan("");
        setEmail("");
        setSoDienThoai("");
        setSoDuTaiKhoan("");

        setIsModalVisible(false);
        setSelectedMember(null);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            console.log(ten, anhDaiDien, ngaySinh, gioiTinh, diaChi, trangThai, active, taiKhoan, email, soDienThoai, soDuTaiKhoan);
            var formData = new FormData();
            formData.append("_id", selectedMember?._id);
            formData.append("ten", ten);
            formData.append("ngaySinh", ngaySinh);
            formData.append("gioiTinh", String(gioiTinh));
            formData.append("diaChi", diaChi);
            formData.append("trangThai", String(trangThai));
            formData.append("active", String(active));
            formData.append("taiKhoan", taiKhoan);
            formData.append("email", email);
            formData.append("soDienThoai", soDienThoai);
            formData.append("soDuTaiKhoan", String(soDuTaiKhoan));
            if (anhDaiDien) {
                formData.append("anhDaiDien", anhDaiDien);
            }
            const res = await POST_FILE('api/admin/quan_ly_thanh_vien/cap_nhat_thong_tin_thanh_vien', formData);
            if (res?.status === 200) {

                notification.success({
                    message: res?.data?.message,
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
                    message: res?.data?.message,
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
                description: 'Có lỗi xảy ra khi cập nhật thông tin',
                duration: 3,
            });
        }
    };

    const toggleLockStatus = async (_id: any) => {
        try {
            setIsLoading(true);
            var formData = new FormData();
            formData.append("_id", _id);

            const res = await POST('api/admin/quan_ly_thanh_vien/thay_doi_trang_thai', formData);
            if (res?.status === 200) {
                const updatedData: any = data.map((item: any) =>
                    item._id === _id ? { ...item, trangThai: item.trangThai === 0 ? 1 : 0 } : item
                );

                const updatedTrangThai = updatedData.find((item: any) => item._id === _id)?.trangThai;

                notification.success({
                    message: res?.data?.message,
                    description: `${updatedTrangThai === 0 ? "Khóa" : "Mở khóa"} thành viên thành công`,
                    showProgress: true,
                    duration: 3,
                });

                setData(updatedData);
            }
            else {
                notification.error({
                    message: res?.data?.message,
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
                description: 'Có lỗi xảy ra khi cập nhật thông tin',
                duration: 3,
            });
        }
    };

    const ThongTinThanhVien = async (currentPage = 1, pageSize = 10, ten = "", email = "", trangThai = "", active = "") => {
        try {
            setIsLoading(true);
            var formData = new FormData();
            formData.append("page", String(currentPage));
            formData.append("pageSize", String(10));
            formData.append("ten", ten);
            formData.append("email", email);
            formData.append("trangThai", trangThai);
            formData.append("active", active);
            const res = await POST('api/admin/quan_ly_thanh_vien/danh_sach_thanh_vien', formData);

            if (res?.status === 200) {
                setTotalPage(res.data.content.count);
                setData(res.data.content.processedList);
            }
            else {
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
                description: `Lỗi khi danh sách thành viên`,
                duration: 3,
            });
        }
    }

    const columns: ColumnType<{ key: number; index: number; id: number; name: string; isLocked: boolean }>[] = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            render: (_: any, __any: any, index: any) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "TÊN THÀNH VIÊN",
            dataIndex: "ten",
            key: "ten",
            align: "center",
        },
        {
            title: "THÔNG TIN",
            key: "info",
            align: "center",
            render: (_: any, record: any) => (
                <Button style={{ backgroundColor: '#1677FF', fontSize: '12px', fontWeight: 'bold', color: 'white' }} onClick={() => handleShowInfo(record)}>
                    CHI TIẾT
                </Button>
            ),
        },
        {
            title: "TRẠNG THÁI",
            dataIndex: "trangThai",
            key: "trangThai",
            align: "center",
            render: (_: any, record: any) => (
                <>
                    <Button
                        style={{
                            backgroundColor: Number(record.trangThai) === 0 ? "#ffcccc" : "#b3e5fc",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}
                        onClick={() => toggleLockStatus(record._id)}
                    >
                        {Number(record.trangThai) === 0 ? "🔑" : "🔒"}
                    </Button>
                </>
            ),
        },
        {
            title: "LOẠI TÀI KHOẢN",
            dataIndex: "active",
            key: "active",
            align: "center",
            render: (_: any, record: any) => {
                if (Number(record.active) === 2) {
                    return (
                        <div color="gold" className={s.vip_blink}>
                            <CrownOutlined style={{ fontSize: "14px" }} />
                            VIP
                        </div>
                    );
                } else if (Number(record.active) === 1) {
                    return (
                        <div color="blue" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                            THƯỜNG
                        </div>
                    );
                } else if (Number(record.active) === 0) {
                    return (
                        <div color="red" style={{ fontSize: '12px', fontWeight: 'bold', color: 'red' }}>
                            CHƯA KÍCH HOẠT
                        </div>
                    );
                } else {
                    return (
                        <div color="gray" style={{ fontSize: '12px', fontWeight: 'bold', color: 'gray' }}>
                            NONE
                        </div>
                    );
                }
            }
        },
    ];

    useEffect(() => {
        if (access_token) {
            ThongTinThanhVien(currentPage, pageSize, tenSearch, emailSearch, trangThaiSearch, activeSearch)
        }
    }, [access_token, currentPage])

    useEffect(() => {
        if (onSearch) {
            ThongTinThanhVien(currentPage, pageSize, tenSearch, emailSearch, trangThaiSearch, activeSearch)
            setOnSearch(0);
        }
    }, [onSearch])

    return (
        <div className={s.personalInfoContainer} style={{ padding: "20px" }}>
            <h1>Thông tin thành viên</h1>
            <div style={{ marginBottom: "20px" }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Input
                            placeholder="Nhập tên"
                            value={tenSearch}
                            onChange={(e) => setTenSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Input
                            placeholder="Nhập email"
                            value={emailSearch}
                            onChange={(e) => setEmailSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Chọn trạng thái"
                            value={trangThaiSearch}
                            onChange={(value) => setTrangThaiSearch(value)}
                            style={{ width: "100%", textAlign: "left" }}
                        >
                            <Option value="">Chọn trạng thái</Option>
                            <Option value="0">Khóa</Option>
                            <Option value="1">Hoạt động</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Chọn active"
                            value={activeSearch}
                            onChange={(value) => setActiveSearch(value)}
                            style={{ width: "100%", textAlign: "left" }}
                        >
                            <Option value="">Chọn loại tài khoản</Option>
                            <Option value="0">Chưa kích hoạt</Option>
                            <Option value="1">Thành viên thường</Option>
                            <Option value="2">Thành viên vip</Option>
                        </Select>
                    </Col>
                </Row>
            </div>
            <Row justify="start" style={{ marginBottom: "20px" }}>
                <Col xs={24} sm={12} md={6} style={{ display: "flex", alignItems: "flex-start" }}>
                    <button
                        style={{ padding: "7px", width: '100px', backgroundColor: "#1890ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                        onClick={() => { setOnSearch(1); }}
                    >
                        Tìm kiếm
                    </button>
                </Col>
            </Row>
            <Table
                dataSource={data}
                scroll={{ x: 900 }}
                columns={columns}
                pagination={{
                    pageSize: pageSize,
                    current: currentPage,
                    total: totalPage,
                    onChange: handlePageChange
                }}
                className="table_2"
            />

            <Modal
                title={<div style={{ textAlign: 'center' }}>Thông tin chi tiết</div>}
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button onClick={handleCloseModal}>
                            Đóng
                        </Button>
                        <Button type="primary" onClick={handleSubmit}>
                            Cập nhật
                        </Button>
                    </div>
                }
                width={800}
                centered
                bodyStyle={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: '20px',
                }}
            >
                {selectedMember && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img
                                src={selectedMember?.anhDaiDien || "/avatar_image.png"}
                                alt="Avatar"
                                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>ID</label>
                                <Input value={selectedMember?._id || ''} disabled style={{ color: '#000000' }} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Tên</label>
                                <Input value={ten || ''} onChange={(e) => setTen(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ảnh đại diện</label>
                                <Input type="file" accept="image/*" onChange={(e: any) => setAnhDaiDien(e.target.files[0])} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày sinh</label>
                                <input
                                    type="date"
                                    name="ngaySinh"
                                    value={ngaySinh}
                                    style={{
                                        width: '100%',
                                        padding: '5px 11px',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                    onChange={(e) => setNgaySinh(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Giới tính</label>
                                <Select style={{ width: '100%' }} value={gioiTinh} onChange={(value) => setGioiTinh(value)} >
                                    <Option value={1}>Nam</Option>
                                    <Option value={0}>Nữ</Option>
                                    <Option value={2}>Khác</Option>
                                </Select>
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Địa chỉ</label>
                                <Input value={diaChi || ''} onChange={(e) => setDiaChi(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', gap: '10px' }}>
                                <label>Trạng thái ({trangThai === 1 ? 'Hoạt động' : 'Khóa'})</label>
                                <Switch checked={trangThai === 1} onChange={(checked) => setTrangThai(checked ? 1 : 0)} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Loại thành viên</label>
                                <Select style={{ width: '100%' }} value={active} onChange={(value) => setActive(value)} >
                                    <Option value={0}>Chưa kích hoạt</Option>
                                    <Option value={1}>Thường</Option>
                                    <Option value={2}>VIP</Option>
                                </Select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Tài khoản</label>
                                <Input value={taiKhoan || ''} onChange={(e) => setTaiKhoan(e.target.value)} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Email</label>
                                <Input type="email" value={email || ''} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Số điện thoại</label>
                                <Input value={soDienThoai || ''} onChange={(e) => setSoDienThoai(e.target.value)} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Số dư tài khoản</label>
                                <Input type="number" value={Number(soDuTaiKhoan) || 0} onChange={(e) => setSoDuTaiKhoan(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label>Thể loại yêu thích</label>
                            <TextArea value={selectedMember?.chiTietTheLoaiYeuThich?.join("\n") || ''} disabled autoSize={{ minRows: 2, maxRows: 6 }} style={{ color: '#000000' }} />
                        </div>
                        <div>
                            <label>Truyện yêu thích</label>
                            <TextArea value={selectedMember?.chiTietTruyenYeuThich?.join("\n") || ''} disabled autoSize={{ minRows: 2, maxRows: 6 }} style={{ color: '#000000' }} />
                        </div>
                        <div>
                            <label>Truyện đã đọc</label>
                            <TextArea value={selectedMember?.chiTietTruyenDaDoc?.join("\n") || ''} disabled autoSize={{ minRows: 2, maxRows: 6 }} style={{ color: '#000000' }} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày tạo</label>
                                <Input value={formatDate(selectedMember?.ngayTao) || ''} disabled style={{ color: '#000000' }} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày cập nhật</label>
                                <Input value={formatDate(selectedMember?.ngayCapNhat) || ''} disabled style={{ color: '#000000' }} />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ThongTinThanhVien;