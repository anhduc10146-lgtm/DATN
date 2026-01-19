/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Select, notification, Form, Upload, Input, Radio, Spin, Typography, SelectProps, Checkbox, Table, Tag, Modal, Switch } from "antd";
import s from './styles.module.scss'
import { GET, POST, POST_FILE } from '../../../../api/baseAPI';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import { ColumnType } from 'antd/es/table';

const QuanLyKey = ({ setIsLoading }: { setIsLoading: any }) => {
    const navigate = useNavigate();
    //Key Voice
    const [page1, setPage1] = useState(1);
    const [pageSize1, setPageSize1] = useState(5);
    const [count1, setCount1] = useState(1);
    const [keyVoice, setKeyVoice] = useState([]);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);

    const [idVoice, setIdVoice] = useState(0);
    const [key, setKey] = useState("");
    const [mail, setMail] = useState("");
    const [ngayTao, setNgayTao] = useState("");
    const [ngayCapNhat, setNgayCapNhat] = useState("");
    const [trangThai, setTrangThai] = useState(1);
    const [soLuongKyTuChoPhep, setSoLuongKyTuChoPhep] = useState(0);
    const [soLuongKyTuSuDung, setSoLuongKyTuSuDung] = useState(0);
    const [selectedKey1, setSelectedKey1] = useState<any>(null);

    const [key1, setKey1] = useState("");
    const [mail1, setMail1] = useState("");
    const [trangThai1, setTrangThai1] = useState(1);
    const [soLuongKyTuChoPhep1, setSoLuongKyTuChoPhep1] = useState(0);
    const [soLuongKyTuSuDung1, setSoLuongKyTuSuDung1] = useState(0);

    const formatNumber = (value: number) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const DanhSachKeyVoice = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("page", String(page1));
            formData.append("pageSize", String(pageSize1));
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_key_voice', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                setKeyVoice(response?.data?.content);
                setCount1(response?.data?.count);
            }
            else {
                notification.error({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
            }
        }
        catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: 'Có lỗi xảy ra khi cập nhật thông tin',
                duration: 3,
            });
        }
    }

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear(); // Năm

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }

    const handlePageChange1 = (page: any) => {
        setPage1(page);
    };

    const handleChiTietKeyVoice = (data: any) => {
        setIdVoice(data.id);
        setKey(data.key);
        setMail(data.mail);
        setNgayTao(data.ngayTao);
        setNgayCapNhat(data.ngayCapNhat);
        setTrangThai(data.trangThai);
        setSoLuongKyTuChoPhep(data.soLuongKyTuChoPhep);
        setSoLuongKyTuSuDung(data.soLuongKyTuDaSuDung);

        setSelectedKey1(data);
        setIsModalVisible1(true);
    }

    const handleThemMoiKeyVoice = () => {
        setIsModalVisible2(true);
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            var formData = new FormData();
            formData.append("_idKey", selectedKey1?._id);
            formData.append("key", key);
            formData.append("trangThai", String(trangThai));
            formData.append("soLuongKyTuChoPhep", String(soLuongKyTuChoPhep));
            formData.append("soLuongKyTuSuDung", String(soLuongKyTuSuDung));
            formData.append("mail", String(mail));

            const res = await POST('api/admin/quan_ly_truyen/cap_nhat_key_voice', formData);
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
                description: 'Có lỗi xảy ra khi cập nhật key voice',
                duration: 3,
            });
        }
    };

    const handleSubmit1 = async () => {
        try {
            setIsLoading(true);

            var formData = new FormData();
            formData.append("key", key1);
            formData.append("trangThai", String(trangThai1));
            formData.append("soLuongKyTuChoPhep", String(soLuongKyTuChoPhep1));
            formData.append("soLuongKyTuSuDung", String(soLuongKyTuSuDung1));
            formData.append("mail", String(mail1));

            const res = await POST('api/admin/quan_ly_truyen/them_moi_key_voice', formData);
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
                description: 'Có lỗi xảy ra khi cập nhật key voice',
                duration: 3,
            });
        }
    };

    useEffect(() => {
        DanhSachKeyVoice()
    }, [page1])

    //Key API Google
    const [apiGG, setApiGG] = useState([]);
    const [type, setType] = useState('');
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [clientId, setClientId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [redirectUri, setRedirectUri] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [authEmail, setAuthEmail] = useState("");


    const DanhSachAPIGG = async () => {
        setIsLoading(true);
        try {
            const response = await GET('api/admin/quan_ly_truyen/danh_sach_api_gg');
            setIsLoading(false);
            if (response?.status === 200) {
                setApiGG(response?.data?.content);
                setAuthEmail(response?.data?.authEmail);
            }
            else {
                notification.error({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
            }
        }
        catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: 'Có lỗi xảy ra khi cập nhật thông tin',
                duration: 3,
            });
        }
    }

    const handleChiTietApiGG = (data: any) => {
        setType(data.type);
        setClientId(data.client_id);
        setClientSecret(data.client_secret);
        setRedirectUri(data.redirect_uri);
        setRefreshToken(data.refresh_token);

        setIsModalVisible3(true);
    }

    const handleSubmit2 = async () => {
        try {
            setIsLoading(true);

            var formData = new FormData();
            formData.append("type", type.toLowerCase());
            formData.append("CLIENT_ID", clientId);
            formData.append("CLIENT_SECRET", clientSecret);
            formData.append("REDIRECT_URI", redirectUri);
            formData.append("REFRESH_TOKEN", refreshToken);
            console.log(type, clientId, clientSecret, redirectUri, refreshToken);
            notification.success({
                message: "Hệ thống",
                description: "Do phải ghi đè file hệ thống nên hệ thống sẽ gián đoạn trong vài phút",
                showProgress: true,
                duration: 3,
            });
            const res = await POST('api/admin/quan_ly_truyen/cap_nhat_api_gg', formData);
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
                description: 'Có lỗi xảy ra khi cập nhật key api google',
                duration: 3,
            });
        }
    };

    const checkAPI = async (type: any) => {
        try {
            setIsLoading(true);

            var formData = new FormData();
            formData.append("type", type.toLowerCase());

            const res = await POST('api/admin/quan_ly_truyen/check_api_gg', formData);
            if (res?.status === 200) {
                notification.success({
                    message: res?.data?.message,
                    description: res?.data?.content,
                    showProgress: true,
                    duration: 3,
                });
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
                description: 'Có lỗi xảy ra khi kiểm tra key api google',
                duration: 3,
            });
        }
    }

    useEffect(() => {
        DanhSachAPIGG()
    }, [])

    const handleCloseModal = () => {
        setIdVoice(0);
        setKey("");
        setMail("");
        setNgayTao("");
        setNgayCapNhat("");
        setTrangThai(1);
        setSoLuongKyTuChoPhep(0);
        setSoLuongKyTuSuDung(0);

        setKey1("");
        setMail1("");
        setTrangThai1(1);
        setSoLuongKyTuChoPhep1(0);
        setSoLuongKyTuSuDung1(0);

        setClientId("");;
        setClientSecret("");
        setRedirectUri("");
        setRefreshToken("");

        setIsModalVisible1(false);
        setIsModalVisible2(false);
        setIsModalVisible3(false);
        setSelectedKey1(null);
    };

    const columns1: ColumnType<{ key: any; index: any; id: any; name: string; isLocked: boolean }>[] = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            align: "center",
            render: (_: any, record: any) => {
                return <span>#{record.id}</span>
            }
        },
        {
            title: "KEY",
            dataIndex: "key",
            key: "key",
            align: "center",
        },
        {
            title: "TRẠNG THÁI",
            dataIndex: "age",
            key: "age",
            align: "center",
            render: (_: any, record: any) => {
                return <Tag color={record.trangThai === 1 ? 'green' : 'red'} style={{ fontSize: '14px' }}>
                    {record.trangThai === 1 ? "Đang sử dụng" : "Hết hạn"}
                </Tag>
            }
        },
        {
            title: "SỐ LƯỢNG KÝ CÒN LẠI",
            dataIndex: "soLuongKyTuConLai",
            key: "soLuongKyTuConLai",
            align: "center",
            render: (_: any, record: any) => {
                return <span>{formatNumber(record.soLuongKyTuConLai)}</span>
            }
        },
        {
            title: "CHI TIẾT",
            key: "actions",
            align: "center",
            render: (_: any, record: any) => <Button type="primary" onClick={() => handleChiTietKeyVoice(record)}>CHI TIẾT</Button>,
        }
    ];

    const columns2: ColumnType<{ key: any; index: any; id: any; name: string; isLocked: boolean }>[] = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            render: (_: any, __any: any, index: any) => index + 1,
        },
        {
            title: "KEY API",
            dataIndex: "type",
            key: "type",
            align: "center",
        },
        {
            title: "KIỂM TRA",
            key: "check",
            align: "center",
            render: (_: any, record: any) => <Button type="primary" onClick={() => checkAPI(record.type)}>KIỂM TRA</Button>,
        },
        {
            title: "THÔNG TIN",
            key: "info",
            align: "center",
            render: (_: any, record: any) => <Button type="primary" onClick={() => handleChiTietApiGG(record)}>CHI TIẾT</Button>,
        },
    ];

    return (
        <div className={s.personalInfoContainer} style={{ padding: "20px" }}>
            <h1>QUẢN LÝ KEY</h1>
            <div className={s.tableContainer}>
                <div className={s.tableHeader}>
                    <h2 className={s.title}>KEY VOICE</h2>
                    <Button type="primary" onClick={handleThemMoiKeyVoice}>Thêm mới</Button>
                </div>
                <hr className={s.divider} />
                <Table
                    columns={columns1}
                    dataSource={keyVoice}
                    scroll={{ x: 860 }}
                    pagination={{
                        pageSize: pageSize1,
                        current: page1,
                        total: count1,
                        onChange: handlePageChange1
                    }}
                    className="table_2"
                />
            </div>

            <div className={s.tableContainer}>
                <div className={s.tableHeader}>
                    <h2 className={s.title}>KEY API GOOGLE</h2>
                </div>
                <hr className={s.divider} />

                <Table
                    columns={columns2}
                    dataSource={apiGG}
                    scroll={{ x: 860 }}
                    pagination={{ pageSize: 10 }}
                    className="table_2"
                />

            </div>

            <Modal
                title={<div style={{ textAlign: 'center' }}>Thông tin chi tiết</div>}
                visible={isModalVisible1}
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
                {selectedKey1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>_ID</label>
                                <Input value={selectedKey1?._id || ''} disabled style={{ color: '#000000' }} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>key</label>
                                <Input value={key || ''} onChange={(e) => setKey(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Mail</label>
                                <Input value={mail || ''} onChange={(e) => setMail(e.target.value)} />
                            </div>
                            <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', gap: '10px' }}>
                                <label>Trạng thái ({trangThai === 1 ? 'Đang sử dụng' : 'Hết hạn'})</label>
                                <Switch checked={trangThai === 1} onChange={(checked) => setTrangThai(checked ? 1 : 0)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Số lượng ký tự cho phép</label>
                                <Input type="number" value={soLuongKyTuChoPhep || 0} onChange={(e: any) => setSoLuongKyTuChoPhep(e.target.value)} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Số lượng ký tự đã sử dụng</label>
                                <Input type="number" value={soLuongKyTuSuDung || 0} onChange={(e: any) => setSoLuongKyTuSuDung(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày tạo</label>
                                <Input value={formatDate(ngayTao) || ''} disabled style={{ color: '#000000' }} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày cập nhật</label>
                                <Input value={formatDate(ngayCapNhat) || ''} disabled style={{ color: '#000000' }} />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                title={<div style={{ textAlign: 'center' }}>Thêm mới key voice</div>}
                visible={isModalVisible2}
                onCancel={handleCloseModal}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button onClick={handleCloseModal}>
                            Đóng
                        </Button>
                        <Button type="primary" onClick={handleSubmit1}>
                            Thêm mới
                        </Button>
                    </div>
                }
                width={600}
                centered
                bodyStyle={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: '20px',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ flex: '1 1 45%' }}>
                            <label>key</label>
                            <Input value={key1 || ''} onChange={(e) => setKey1(e.target.value)} />
                        </div>
                        <div style={{ flex: '1 1 45%' }}>
                            <label>Mail</label>
                            <Input value={mail1 || ''} onChange={(e) => setMail1(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ flex: '1 1 45%' }}>
                            <label>Số lượng ký tự cho phép</label>
                            <Input type="number" value={soLuongKyTuChoPhep1 || 0} onChange={(e: any) => setSoLuongKyTuChoPhep1(e.target.value)} />
                        </div>
                        <div style={{ flex: '1 1 45%' }}>
                            <label>Số lượng ký tự đã sử dụng</label>
                            <Input type="number" value={soLuongKyTuSuDung1 || 0} onChange={(e: any) => setSoLuongKyTuSuDung1(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', gap: '10px' }}>
                            <label>Trạng thái ({trangThai === 1 ? 'Đang sử dụng' : 'Hết hạn'})</label>
                            <Switch checked={trangThai1 === 1} onChange={(checked) => setTrangThai1(checked ? 1 : 0)} />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                title={<div style={{ textAlign: 'center' }}>Thông tin chi tiết</div>}
                visible={isModalVisible3}
                onCancel={handleCloseModal}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button onClick={handleCloseModal}>
                            Đóng
                        </Button>
                        <Button type="primary" onClick={handleSubmit2}>
                            Cập nhật
                        </Button>
                    </div>
                }
                width={600}
                centered
                bodyStyle={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: '20px',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ flex: '1 1 45%' }}>
                            <label>CLIENT_ID</label>
                            <Input value={clientId || ''} onChange={(e) => setClientId(e.target.value)} />
                        </div>
                        <div style={{ flex: '1 1 45%' }}>
                            <label>CLIENT_SECRET</label>
                            <Input value={clientSecret || ''} onChange={(e) => setClientSecret(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ flex: '1 1 45%' }}>
                            <label>REDIRECT_URI</label>
                            <Input value={redirectUri || ""} onChange={(e: any) => setRedirectUri(e.target.value)} />
                        </div>
                        <div style={{ flex: '1 1 45%' }}>
                            <label>REFRESH_TOKEN</label>
                            <Input value={refreshToken || ""} onChange={(e: any) => setRefreshToken(e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ flex: '1' }}>
                            <label>AUTH_EMAIL</label>
                            <Input value={authEmail || ""} disabled onChange={(e: any) => setAuthEmail(e.target.value)} />
                        </div>
                    </div>
                </div>
            </Modal>
        </div >
    );
}

export default QuanLyKey;