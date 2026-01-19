import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Typography, Modal, message, Table, notification, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import s from './styles.module.scss';
import { GET, POST } from '../../../api/baseAPI';

const { Title, Text } = Typography;

type RowData = {
    goi: string;
    loai: string;
    ngayHetHan: string;
}

const NangCapTaiKhoan = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
    const access_token = localStorage.getItem('access_token');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>({});
    const [selectedGoi, setSelectedGoi] = useState<any>('1');
    const [soDuTaiKhoan, setSoDuTaiKhoan] = useState<any>(0);
    const [danhSachGoi, setDanhSachGoi] = useState<RowData[]>([]);
    const [soDuTaiSauGiaHan, setSoDuSauGiaHan] = useState<any>(0);

    // Dữ liệu các gói đã sở hữu
    const ownedPlans = [
        { goi: 'Thành viên vip', loai: 'VIP 1', ngayHetHan: '15/05/2025' },
    ];

    const DanhSachGoi1 = async () => {
        try {
            setIsLoading(true);
            const data = await GET('api/member/quan_ly_nang_cap/danh_sach_goi_so_huu');
            if (data?.status === 200) {
                setDanhSachGoi(data?.data?.content);
            }
            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi lấy danh sách gói sở hữu`,
                duration: 3,
            });
        }
    }

    const thongTinTaiKhoan = async () => {
        try {
            setIsLoading(true);
            const data = await GET('api/member/quan_ly_thong_tin/thong_tin_tai_khoan');
            if (data?.status === 200) {
                const userInfo = data?.data?.content;
                setSoDuTaiKhoan(userInfo?.soDuTaiKhoan);
                setSoDuSauGiaHan(userInfo?.soDuTaiKhoan - 25000 < 0 ? 0 : userInfo?.soDuTaiKhoan - 25000);
            }
            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi lấy thông tin tài khoản`,
                duration: 3,
            });
        }
    }

    const handleUpgrade = (plan: any) => {
        if (soDuTaiKhoan >= 25000) {
            setSelectedPlan(plan);
            setIsModalVisible(true);
        }
        else {
            notification.error({
                message: 'Nâng cấp tài khoản',
                description: `Số dư tài khoản không đủ`,
                duration: 3,
            });
        }

    };

    const handleConfirmUpgrade = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            const data = await POST('api/member/quan_ly_nang_cap/nang_cap_tai_khoan', formData);
            setIsLoading(false);
            setIsModalVisible(false);

            if (data?.status === 200) {
                notification.success({
                    message: data?.data?.message,
                    description: data?.data?.content,
                    duration: 3,
                });

                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
            else {
                notification.error({
                    message: data?.data?.message,
                    description: data?.data?.content,
                    duration: 3,
                });
            }
        }
        catch (error) {
            setIsLoading(false);
            setIsModalVisible(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi nâng cấp tài khoản`,
                duration: 3,
            });
        }
    };

    const handleConfirmRenew = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('soThang', selectedGoi)
            const data = await POST('api/member/quan_ly_nang_cap/gia_han_goi', formData);
            setIsLoading(false);
            setIsModalVisible1(false);

            if (data?.status === 200) {
                notification.success({
                    message: data?.data?.message,
                    description: data?.data?.content,
                    duration: 3,
                });

                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
            else {
                notification.error({
                    message: data?.data?.message,
                    description: data?.data?.content,
                    duration: 3,
                });
            }
        }
        catch (error) {
            setIsLoading(false);
            setIsModalVisible1(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi gia hạn gói`,
                duration: 3,
            });
        }
    }
    const handleCancelUpgrade = () => {
        setIsModalVisible(false);
        setIsModalVisible1(false);
    };

    const handleSelectGoi = (value: any) => {
        setSelectedGoi(value)
    }

    const handleRenew = () => {
        setIsModalVisible1(true);
    };

    useEffect(() => {
        if (selectedGoi !== '1' && selectedGoi) {
            const tien = [
                25000,
                45000,
                65000,
                85000,
                105000,
                125000,
                145000,
                165000,
                185000,
                205000,
                225000,
                245000
            ];
            setSoDuSauGiaHan(soDuTaiKhoan - tien[Number(selectedGoi) - 1] < 0 ? 0 : soDuTaiKhoan - tien[Number(selectedGoi) - 1])
        }
    }, [selectedGoi])

    useEffect(() => {
        if (access_token) {
            thongTinTaiKhoan();
            DanhSachGoi1();
        }
    }, [access_token])

    const options = [
        { value: '1', label: '25000 VNĐ / 1 tháng' },
        { value: '2', label: '45000 VNĐ / 2 tháng' },
        { value: '3', label: '65000 VNĐ / 3 tháng' },
        { value: '4', label: '85000 VNĐ / 4 tháng' },
        { value: '5', label: '105000 VNĐ / 5 tháng' },
        { value: '6', label: '125000 VNĐ / 6 tháng' },
        { value: '7', label: '145000 VNĐ / 7 tháng' },
        { value: '8', label: '165000 VNĐ / 8 tháng' },
        { value: '9', label: '185000 VNĐ / 9 tháng' },
        { value: '10', label: '205000 VNĐ / 10 tháng' },
        { value: '11', label: '225000 VNĐ / 11 tháng' },
        { value: '12', label: '245000 VNĐ / 12 tháng' },
    ]

    const columns: ColumnsType<RowData> = [
        {
            title: 'GÓI',
            dataIndex: 'goi',
            key: 'goi',
            align: 'center',
        },
        {
            title: 'LOẠI',
            dataIndex: 'loai',
            key: 'loai',
            align: 'center',
        },
        {
            title: 'NGÀY HẾT HẠN',
            dataIndex: 'ngayHetHan',
            key: 'ngayHetHan',
            align: 'center',
        },
        {
            title: 'TÙY CHỌN',
            key: 'options',
            align: 'center',
            render: (text: any, record: any) => (
                <Button
                    type="primary"
                    onClick={() => handleRenew()}
                >
                    <span style={{ fontWeight: 'bold' }}>Gia hạn</span>
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }} className={s.pageContainer}>
            <h1 className={s.title}>NÂNG CẤP TÀI KHOẢN</h1>

            <Row gutter={16} justify="center">
                <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                    <Card
                        title="Thành viên vip"
                        bordered={false}
                        hoverable
                        className={s.card}
                    >
                        <Title level={4} style={{ marginTop: "0px" }}>VIP 1</Title>
                        <Text>Sử dụng thêm chức năng nghe truyện</Text>
                        <div className={s.price}>25000 VND/tháng</div>
                        <Button type="primary" block onClick={() => handleUpgrade({ goi: "Thành viên vip", loai: "VIP 1", gia: 25000 })}>
                            Nâng cấp ngay
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Title level={3} style={{ marginTop: '30px' }}>Gói đã sở hữu</Title>
            <Table
                columns={columns}
                dataSource={danhSachGoi}
                rowKey="maGiaoDich"
                pagination={false}
                bordered
                scroll={{ x: 800 }}
            />

            <Modal
                title={`Xác nhận nâng cấp`}
                visible={isModalVisible}
                onOk={handleConfirmUpgrade}
                onCancel={handleCancelUpgrade}
                okText="Thanh toán"
                cancelText="Không"
                width={400}
                style={{ width: '100%', textAlign: 'center' }}
            >
                <p>Số dư tài khoản của bạn hiện tại là: <span className={`${s.blinking_text} ${s.color1}`}>{soDuTaiKhoan}</span> VNĐ</p>
                <p>Số dư tài khoản của bạn sau nâng cấp là: <span className={`${s.blinking_text} ${s.color2}`}>{(soDuTaiKhoan - selectedPlan.gia) > 0 ? (soDuTaiKhoan - selectedPlan.gia) : 0}</span> VNĐ</p>
                <p><strong>Lưu ý:</strong> Sau khi bấm thanh toán hệ thống sẽ tự động trừ vào số dư tài khoản của thành viên vui lòng kiểm tra tại phần lịch sử giao dịch</p>
            </Modal>

            <Modal
                title={`Xác nhận gia hạn`}
                visible={isModalVisible1}
                onOk={handleConfirmRenew}
                onCancel={handleCancelUpgrade}
                okText="Gia hạn"
                cancelText="Không"
                width={400}
                style={{ width: '100%', textAlign: 'center' }}
            >
                <p>
                    Chọn số tháng gia hạn{" "}
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn gói"
                        value={selectedGoi || undefined}
                        onChange={(value: any) => handleSelectGoi(value)}
                        options={options}
                    >
                    </Select>
                </p>
                <p>Số dư tài khoản của bạn hiện tại là: <span className={`${s.blinking_text} ${s.color1}`}>{soDuTaiKhoan}</span> VNĐ</p>
                <p>Số dư tài khoản của bạn sau gia hạn là: <span className={`${s.blinking_text} ${s.color2}`}>{soDuTaiSauGiaHan}</span> VNĐ</p>
                <p><strong>Lưu ý:</strong> Sau khi bấm thanh toán hệ thống sẽ tự động trừ vào số dư tài khoản của thành viên vui lòng kiểm tra tại phần lịch sử giao dịch</p>
            </Modal>
        </div>
    );
};

export default NangCapTaiKhoan;
