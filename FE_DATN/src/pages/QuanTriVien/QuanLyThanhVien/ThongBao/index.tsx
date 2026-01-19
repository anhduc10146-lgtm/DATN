/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Select, InputNumber, notification, QRCode, Modal, Table, Tag, Col, Input, Row, DatePicker, Avatar } from "antd";
import s from './styles.module.scss'
import { GET, POST, POST_FILE } from '../../../../api/baseAPI';
import { ColumnType } from 'antd/es/table';

const { Option } = Select;


const QuanLyThongBao = ({ setIsLoading, setSoLuongThongBao }: { setIsLoading: any, setSoLuongThongBao: any }) => {
    const [selectedNotification, setSelectedNotification] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [loai, setLoai] = useState("");
    const [trangThai, setTrangThai] = useState("");
    const [idThanhVien, setIdThanhVien] = useState("");
    const [tuNgay, setTuNgay] = useState("");
    const [denNgay, setDenNgay] = useState("");
    const [listThongBao, setListThongBao] = useState<any[]>([]);
    const [onSearch, setOnSearch] = useState<any>(0);
    const [selectTTHĐ, setSelectedTTHĐ] = useState<any>(3);
    const [selectIDHĐ, setSelectedIDHĐ] = useState<any>(0);

    const options = [
        { value: 0, label: 'Đã xóa' },
        { value: 1, label: 'Đang xử lý' },
        { value: 2, label: 'Lỗi' },
        { value: 3, label: 'Thành công' },
        { value: 4, label: 'Hủy' }
    ];

    const formatDate = (date: string) => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    };

    const handleShowInfo = (notification: any) => {
        danhDauDaDoc(notification._id);
        if (notification.loai === 0)
            setSelectedTTHĐ(notification?.hoaDon?.trangThai)
        setSelectedNotification(notification);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedNotification(null);
    };

    const handleUpdateHoaDon = () => {
        setIsModalVisible(false);
        setSelectedNotification(null);
        updateHoaDon(selectIDHĐ, selectTTHĐ);
    }

    const updateHoaDon = async (idHoaDon = "", trangThai = "") => {
        try {
            setIsLoading(true);
            var formData = new FormData();
            if (idHoaDon === "") {
                notification.error({
                    message: 'Hệ thống',
                    description: "Không tìm thấy id hóa đơn",
                    duration: 3,
                });
            }

            formData.append("id", String(idHoaDon));
            formData.append("trangThai", String(trangThai));

            const res = await POST('api/admin/quan_ly_thanh_vien/doi_trang_thai_hoa_don', formData);

            if (res?.status === 200) {
                setOnSearch(1)

                notification.success({
                    message: res?.data?.message,
                    description: res?.data?.content,
                    duration: 3,
                });
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
                description: `Lỗi khi thay đổi trạng thái hóa đơn`,
                duration: 3,
            });
        }
    }

    const danhDauDaDoc = async (_idThongBao = "", tatCa = "") => {
        try {
            setIsLoading(true);
            var formData = new FormData();
            if (tatCa !== "") {
                formData.append("danhDauTatCa", "1");
            }
            if (_idThongBao !== "")
                formData.append("_id", _idThongBao);

            const res = await POST('api/admin/quan_ly_thanh_vien/doi_trang_thai_thong_bao', formData);

            if (res?.status === 200) {
                DanhSachThongBao(page, pageSize, loai, trangThai, tuNgay, denNgay)
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
                description: `Lỗi khi đánh dấu thông báo`,
                duration: 3,
            });
        }
    }

    const handlePageChange = (page: any) => {
        setPage(page);
        setOnSearch(1);
    };

    const handleSearch = () => {
        setPage(1);
        setOnSearch(1);
    };

    const handleTatCa = () => {
        setPage(1);
        setLoai("");
        setIdThanhVien("");
        setTuNgay("");
        setDenNgay("");
        setOnSearch(1);
    };

    const handleThongBao = async () => {
        try {
            setIsLoading(true);
            const res = await GET('api/admin/quan_ly_thanh_vien/so_luong_thong_bao_chua_doc');
            setIsLoading(false);
            if (res?.status === 200) {
                setSoLuongThongBao(res?.data?.content);
            }
            else {
                notification.error({
                    message: 'Lỗi khi lấy thông báo',
                    description: `${res?.data?.content}`,
                    showProgress: true,
                    duration: 3,
                });

            }

        }
        catch {
            notification.error({
                message: 'Hệ thống',
                description: 'Lỗi không xác định, vui lòng kiểm tra cơ sở dữ liệu!',
                duration: 3,
            });
        }
    }

    const DanhSachThongBao = async (page = 1, pageSize = 10, loai = "", trangThai = "", tuNgay = "", denNgay = "") => {
        try {

            if (tuNgay && denNgay) {
                const dateTuNgay = new Date(tuNgay);
                const dateDenNgay = new Date(denNgay);

                if (dateDenNgay < dateTuNgay) {
                    notification.error({
                        message: 'Hệ thống',
                        description: "'Đến ngày' phải có giá trị lớn hơn 'Từ ngày'",
                        duration: 3,
                    });
                    return;
                }
            }

            setIsLoading(true);
            var formData = new FormData();
            formData.append("page", String(page));
            formData.append("pageSize", String(10));
            formData.append("loai", loai);
            formData.append("trangThai", trangThai);
            formData.append("tuNgay", formatDate(tuNgay));
            formData.append("denNgay", formatDate(denNgay));
            const res = await POST('api/admin/quan_ly_thanh_vien/danh_sach_thong_bao', formData);

            if (res?.status === 200) {
                console.log(res?.data?.content)
                setTotalPage(res?.data?.total);
                setListThongBao(res?.data?.content);
                setOnSearch(0);
            }
            else {
                setListThongBao([]);
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
                description: `Lỗi khi danh sách thông báo`,
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
            render: (_: any, __: any, index: any) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            align: "center",
            render: (id: any) => `#${id}`,
        },
        {
            title: "LOẠI",
            dataIndex: "loai",
            key: "loai",
            align: "center",
            render: (loai: any) => `${loai === 0 ? 'Nạp tiền' : (loai === 1 ? 'Đề xuất truyện' : (loai === 2 ? 'Nâng cấp tài khoản' : 'Gia hạn gói'))}`,
        },
        {
            title: "THÀNH VIÊN",
            dataIndex: "thanhVienTen",
            key: "thanhVienTen",
            align: "center",
        },
        {
            title: "TRẠNG THÁI",
            dataIndex: "trangThai",
            key: "trangThai",
            align: "center",
            render: (trangThai: any) => {
                let color = trangThai === 0 ? 'red' : 'green';
                let text = trangThai === 0 ? 'CHƯA XEM' : 'ĐÃ XEM';
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "THÔNG TIN",
            key: "info",
            align: 'center',
            render: (_: any, record: any) => (
                <Button type="primary" onClick={() => handleShowInfo(record)}>
                    THÔNG TIN
                </Button>
            ),
        },
    ];

    useEffect(() => {
        if (onSearch === 1)
            DanhSachThongBao(page, pageSize, loai, trangThai, tuNgay, denNgay)
    }, [onSearch])

    useEffect(() => {
        DanhSachThongBao()
        handleThongBao()
    }, [])

    return (
        <div className={s.personalInfoContainer} style={{ padding: "20px" }}>
            <h1>Quản lý thông báo</h1>

            <div style={{ marginBottom: "20px" }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8} md={8}>
                        <Select
                            placeholder="Chọn loại thông báo"
                            value={loai}
                            onChange={(value) => { setLoai(value) }}
                            style={{ width: "100%", textAlign: "left" }}
                        >
                            <Option value="">Chọn loại thông báo</Option>
                            <Option value="0">Nạp tiền</Option>
                            <Option value="1">Đề xuất truyện</Option>
                            <Option value="2">Nâng cấp tài khoản</Option>
                            <Option value="3">Gia hạn gói</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={8}>
                        <Select
                            placeholder="Chọn trạng thái"
                            value={trangThai}
                            onChange={(value) => { setTrangThai(value) }}
                            style={{ width: "100%", textAlign: "left" }}
                        >
                            <Option value="">Chọn trạng thái</Option>
                            <Option value="0">Chưa xem</Option>
                            <Option value="1">Đã xem</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={8}>
                        <Input
                            placeholder="Nhập id thành viên"
                            value={idThanhVien}
                            onChange={(e) => setIdThanhVien(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                    <Col xs={12} sm={12} md={12} className={s.field}>
                        <label>Từ ngày</label>
                        <input
                            type="date"
                            value={tuNgay}
                            onChange={(e: any) => { setTuNgay(e.target.value); }}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={12} className={s.field}>
                        <label>Đến ngày</label>
                        <input
                            type="date"

                            value={denNgay}
                            onChange={(e: any) => { setDenNgay(e.target.value); }}
                        />
                    </Col>
                </Row>
            </div>
            <Row justify="start" style={{ marginBottom: "20px" }}>
                <Col xs={24} sm={12} md={8} style={{ display: "flex", alignItems: "flex-start", gap: '10px' }}>
                    <button
                        style={{ padding: "7px", width: '100px', backgroundColor: "#1890ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                        onClick={handleSearch}
                    >
                        Tìm kiếm
                    </button>
                    <button
                        style={{ padding: "7px", width: '100px', backgroundColor: "#1890ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                        onClick={handleTatCa}
                    >
                        Tất cả
                    </button>
                </Col>
            </Row>

            <Table
                dataSource={listThongBao}
                scroll={{ x: 800 }}
                columns={columns}
                pagination={{
                    pageSize: pageSize,
                    current: page,
                    total: totalPage,
                    onChange: handlePageChange
                }}
                className="table_2"
            />

            <Modal
                title={
                    <div style={{ textAlign: "center" }}>
                        {`Thông báo ${selectedNotification?.ten}`.toUpperCase()}
                    </div>
                }
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={
                    <>
                        {[0].includes(selectedNotification?.loai) && <Button color="danger" variant="solid" onClick={handleUpdateHoaDon}>
                            Cập nhật hóa đơn
                        </Button>}
                        <Button type="primary" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                    </>
                }
            >
                {selectedNotification && (
                    <div className="notification-details">
                        <p>
                            <span className="label">_ID:</span>
                            <span className="value">{selectedNotification._id}</span>
                        </p>
                        <p>
                            <span className="label">ID:</span>
                            <span className="value">{selectedNotification.id}</span>
                        </p>
                        <p>
                            <span className="label">Loại:</span>
                            <span className="value">
                                {selectedNotification.loai === 0
                                    ? 'Nạp tiền'
                                    : selectedNotification.loai === 1
                                        ? 'Đề xuất truyện'
                                        : selectedNotification.loai === 2
                                            ? 'Nâng cấp tài khoản'
                                            : 'Gia hạn gói'}
                            </span>
                        </p>
                        <p>
                            <span className="label">Thành Viên:</span>
                            <span className="value">{selectedNotification.thanhVienTen}</span>
                        </p>
                        <p>
                            <span className="label">Trạng Thái:</span>
                            <span className="value">
                                {selectedNotification.trangThai === 0 ? 'Chưa xem' : 'Đã xem'}
                            </span>
                        </p>
                        <p>
                            <span className="label">Nội dung:</span>
                            <span className="value">
                                {selectedNotification.noiDung}
                            </span>
                        </p>
                        <p>
                            <span className="label">Ngày tạo:</span>
                            <span className="value">{new Date(selectedNotification.ngayTao - 420 * 60 * 1000).toLocaleString()}</span>
                        </p>
                        <p>
                            <span className="label">Ngày xem:</span>
                            <span className="value">{selectedNotification.ngayXem ? new Date(selectedNotification.ngayXem - 420 * 60 * 1000).toLocaleString() : 'Chưa cập nhật'}</span>
                        </p>

                        <hr style={{ border: 'none', borderTop: "1px dashed #ccc", margin: "20px 0" }} />

                        {(selectedNotification.loai === 0 || selectedNotification.loai === 2 || selectedNotification.loai === 3) ?
                            (
                                <>
                                    <p>
                                        <span className="label">IDHĐ:</span>
                                        <span className="value">
                                            {selectedNotification.hoaDon.id}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="label">TTHĐ:</span>
                                        <span className="value">
                                            <Select
                                                value={selectTTHĐ}
                                                options={options}
                                                onChange={(value) => {
                                                    setSelectedTTHĐ(value);
                                                    setSelectedIDHĐ(selectedNotification.hoaDon.id)
                                                }}
                                                style={{ width: '150px', padding: '2px 0px' }}
                                            />
                                        </span>
                                    </p>
                                </>
                            )
                            :
                            <></>
                        }
                        {(selectedNotification.loai === 1) ?
                            (
                                <>
                                    <p>
                                        <span className="label">IDBT:</span>
                                        <span className="value">
                                            {selectedNotification.deXuat._id}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="label">Tên BT:</span>
                                        <span className="value">
                                            {selectedNotification.deXuat.ten}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="label">Tác giả:</span>
                                        <span className="value">
                                            {selectedNotification.deXuat.tacGia}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="label">Tóm tắt:</span>
                                        <span className="value">
                                            {selectedNotification.deXuat.tomTat}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="label">Thời gian:</span>
                                        <span className="value">{new Date(selectedNotification.ngayTao - 420 * 60 * 1000).toLocaleString()}</span>
                                    </p>
                                </>
                            )
                            :
                            <></>
                        }
                    </div>
                )}

            </Modal>
        </div >
    );
}

export default QuanLyThongBao;