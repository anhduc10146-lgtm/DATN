/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, DatePicker, message, Modal, notification, Select, Spin, Table, Typography } from "antd";
import s from './styles.module.scss'
import { GET, POST } from '../../../api/baseAPI';
import { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

const { Option } = Select;

type GiaoDich = {
    id: string;
    ngayTao: string;
    hanhDong: string;
    tongSoTien: number;
    trangThai: string;
};

const MY_BANK = {
    BANK_ID: "vietinbank",
    ACCOUNT_NO: "103870480117"
}

const LichSuGiaoDich = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
    const [data, setData] = useState<GiaoDich[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [trangThai, setTrangThai] = useState(null);
    const [hanhDong, setHanhDong] = useState(null);
    const [ngayTao, setNgayTao] = useState(null);
    const [qrCode, setQrCode] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleShowInfo = (data: any) => {
        setQrCode(`https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-qr_only.png?amount=${data.soTien}&addInfo=${data.noiDungChuyenKhoan}`)
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setQrCode("");
    };

    const handleSearch = () => {
        setPage(1);
        DanhSachHoaDon();
    };

    const handleAll = () => {
        setTrangThai(null);
        setHanhDong(null)
        setNgayTao(null)
        setPage(1);
        DanhSachHoaDon();
    };

    const DanhSachHoaDon = async () => {
        try {
            const formData = new FormData();
            if (trangThai)
                formData.append("trangThai", trangThai);

            if (hanhDong)
                formData.append("hanhDong", hanhDong);

            if (ngayTao)
                formData.append("ngayTao", ngayTao);

            setIsLoading(true);
            const res = await POST('api/member/quan_ly_nap_tien/danh_sach_hoa_don', formData);
            setIsLoading(false);

            if (res.status === 200) {
                setData(res?.data?.content);
                setTotalPage(res?.data?.total);
            }
        }
        catch (error) {
            notification.error({
                message: 'Hệ thống',
                description: 'Có lỗi xảy ra khi cập nhật thông tin',
                duration: 3,
            });
        }
    }

    const handleTableChange = (page: any) => {
        setPage(page);
        DanhSachHoaDon();
    };

    useEffect(() => {
        DanhSachHoaDon();
    }, []);

    const columns: ColumnsType<GiaoDich> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            align: 'center',
            render: (_: any, __: GiaoDich, index: number) => index + 1,
            responsive: ['sm'],
        },
        {
            title: 'MÃ GIAO DỊCH',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (data: any) => {
                return `#${data}`
            }
        },
        {
            title: 'LOẠI',
            dataIndex: 'hanhDong',
            key: 'hanhDong',
            align: 'center',
            render: (data: any) => {
                return data === 1 ? <span>Nâng cấp tài khoản</span> : (data === 2 ? <span>Gia hạn gói</span> : <span>Nạp tiền</span>)
            }
        },
        {
            title: 'NGÀY GIAO DỊCH',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            align: 'center',
        },
        {
            title: 'SỐ TIỀN',
            dataIndex: 'tongSoTien',
            key: 'tongSoTien',
            align: 'center',
            render: (text: any, record: any) => {
                if (record.trangThai === 4 || record.trangThai === 2 || record.trangThai === 1) {
                    return (
                        <span>
                            {text} VND
                        </span>
                    );
                }
                else if (record.trangThai === 3) {
                    if (record.hanhDong === 0)
                        return (
                            <span style={{ color: 'green' }}>
                                + {text} VND
                            </span>
                        );
                    else if (record.hanhDong === 1 || record.hanhDong === 2) {
                        return (
                            <span style={{ color: 'red' }}>
                                - {text} VND
                            </span>
                        );
                    }
                }
            },
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'trangThai',
            key: 'trangThai',
            align: 'center',
            render: (data: any, record: any) => {
                let color;
                let trangThai;
                switch (data) {
                    case 2:
                        color = 'red';
                        trangThai = 'Lỗi'
                        break;
                    case 3:
                        trangThai = 'Thành công'
                        color = 'green';
                        break;
                    case 1:
                        color = '#f1c40f';
                        trangThai = 'Đang xử lý';
                        break;
                    case 4:
                        color = 'black';
                        trangThai = 'Hủy';
                        break;
                    default:
                        color = 'black';
                        trangThai = 'Khác';
                        break;
                }
                if (data !== 1)
                    return <span style={{ fontSize: '12px', color: 'white', fontWeight: 'bold', backgroundColor: color, padding: '4px 8px', borderRadius: '4px' }}>{trangThai}</span>;
                else
                    return <button onClick={() => handleShowInfo(record)} style={{ cursor: 'pointer', fontSize: '12px', color: 'white', fontWeight: 'bold', backgroundColor: color, padding: '4px 8px', borderRadius: '4px', border: '0px' }}>{trangThai}</button>;
            },
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 className={s.title} style={{ textAlign: 'center', marginBottom: '20px' }}>
                LỊCH SỬ GIAO DỊCH
            </h1>

            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
                <Select
                    placeholder="Hành động"
                    style={{ width: 200 }}
                    value={hanhDong}
                    onChange={(value) => setHanhDong(value)}
                >
                    <Option value="0">Nạp tiền</Option>
                    <Option value="1">Nâng cấp tài khoản</Option>
                    <Option value="2">Gia hạn gói</Option>
                </Select>
                <Select
                    placeholder="Trạng thái"
                    style={{ width: 200 }}
                    value={trangThai}
                    onChange={(value) => setTrangThai(value)}
                >
                    <Option value="1">Đang xử lý</Option>
                    <Option value="2">Lỗi</Option>
                    <Option value="3">Thành công</Option>
                    <Option value="4">Hủy</Option>
                </Select>
                <DatePicker
                    placeholder="Chọn ngày"
                    onChange={(date: any, dateString: any) => setNgayTao(dateString)}
                />
                <Button type="primary" onClick={handleSearch}>
                    Tìm kiếm
                </Button>

                <Button type="primary" onClick={handleAll}>
                    Tất cả
                </Button>
            </div>

            <Table<GiaoDich>
                columns={columns}
                dataSource={data.map((item, index) => ({ ...item, stt: index + 1 }))}
                scroll={{ x: 800 }}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: totalPage,
                    onChange: handleTableChange,
                    showSizeChanger: false
                }}
                rowKey="maGiaoDich"
                bordered
            />

            <Modal
                title={<div style={{ textAlign: 'center' }}>Mã QR Code</div>}
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button onClick={handleCloseModal}>
                            Đóng
                        </Button>
                    </div>
                }
                width={400}
                centered
                bodyStyle={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: '20px',
                    textAlign: 'center',
                }}
            >
                <img alt="example" src={qrCode} height={200} width={200} />
            </Modal>
        </div>
    );
};

export default LichSuGiaoDich;
