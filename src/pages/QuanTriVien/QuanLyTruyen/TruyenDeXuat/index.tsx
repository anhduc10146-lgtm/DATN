/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Select, InputNumber, notification, QRCode, Table, Modal, Form, Upload, Input, Radio, Space, Tag, Switch, Spin, Row, Col } from "antd";
import { ColumnProps } from "antd/es/table";
import s from './styles.module.scss'
import { GET, POST, POST_FILE } from '../../../../api/baseAPI';
import axios from 'axios';

const { Option } = Select;

const DeXuatTruyen = ({ setIsLoading }: { setIsLoading: any }) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [listDeXuat, setListDeXuat] = useState<any[]>([]);
    const [idNguoiDeXuat, setIdNguoiDeXuat] = useState<any>("")
    const [selectDeXuat, setSelectDeXuat] = useState<any>(null);
    const [onSearch, setOnSearch] = useState<any>(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSearch = () => {
        setPage(1);
        setOnSearch(1);
    };

    const handleTatCa = () => {
        setPage(1);
        setIdNguoiDeXuat("");
        setOnSearch(1);
    };

    const handleShowInfo = (deXuat: any) => {
        setSelectDeXuat(deXuat);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectDeXuat(null);
    };

    const handlePageChange = (page: any) => {
        setPage(page);
        setOnSearch(1);
    };

    const DanhSachDeXuat = async (page = 1, idNguoiDeXuat = "") => {
        try {
            setIsLoading(true);
            var formData = new FormData();
            formData.append("page", String(page));
            formData.append("pageSize", String(10));
            formData.append("_id", idNguoiDeXuat);;
            const res = await POST('api/admin/quan_ly_truyen/danh_sach_de_xuat', formData);

            if (res?.status === 200) {
                console.log(res?.data?.content);
                setTotalPage(res?.data?.total);
                setListDeXuat(res?.data?.content);
                setOnSearch(0);
            }
            else {
                setListDeXuat([]);
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
                description: `Lỗi khi danh sách đề xuất`,
                duration: 3,
            });
        }
    }

    useEffect(() => {
        if (onSearch === 1) {
            DanhSachDeXuat(page, idNguoiDeXuat);
        }
    }, [onSearch])

    useEffect(() => {
        DanhSachDeXuat();
    }, [])

    // Cấu hình các cột của bảng
    const columns: any = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 50,
            render: (_: any, __: any, index: any) => (page - 1) * pageSize + index + 1,
            align: "center",
        },
        {
            title: 'TÊN BỘ TRUYỆN',
            dataIndex: 'ten',
            key: 'ten',
            align: "center",
        },
        {
            title: 'NGÀY ĐỀ XUẤT',
            dataIndex: 'thoiGianDeXuat',
            key: 'thoiGianDeXuat',
            align: "center",
        },
        {
            title: 'NGƯỜI ĐỀ XUẤT',
            dataIndex: 'nguoiDeXuat',
            key: 'nguoiDeXuat',
            align: "center",
        },
        {
            title: 'CHI TIẾT',
            key: 'chiTiet',
            render: (_: any, record: any) => (
                <Button type='primary' onClick={() => handleShowInfo(record)}>
                    Xem chi tiết
                </Button>
            ),
            align: "center",

        },
    ];

    return (
        <div className={s.personalInfoContainer} style={{ padding: "10px" }}>
            <h1>TRUYỆN ĐỀ XUẤT TỪ THÀNH VIÊN</h1>

            <div style={{ marginBottom: "20px" }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={12}>
                        <Input
                            placeholder="Nhập id thành viên"
                            value={idNguoiDeXuat}
                            onChange={(e) => setIdNguoiDeXuat(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} style={{ display: "flex", alignItems: "flex-start", gap: '10px' }}>
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
            </div>

            <div>
                <Table
                    dataSource={listDeXuat}
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
            </div>


            <Modal
                title={
                    <div style={{ textAlign: "center" }}>
                        {`Chi tiết đề xuất`}
                    </div>
                }
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={
                    <>
                        <Button type="primary" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                    </>
                }
            >
                <div className="notification-details-1">
                    <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
                        <img
                            src={selectDeXuat?.trangBia || "/avatar_img.png"}
                            alt="Hình ảnh"
                            className="circular-image"
                        />
                    </p>
                    <p>
                        <span className="label">_ID:</span>
                        <span className="value">
                            {selectDeXuat?._id || "Không có"}
                        </span>
                    </p>
                    <p>
                        <span className="label">Tên bộ truyện:</span>
                        <span className="value">
                            {selectDeXuat?.ten || "Không có"}
                        </span>
                    </p>
                    <p>
                        <span className="label">Tác giả:</span>
                        <span className="value">
                            {selectDeXuat?.tacGia || "Không có"}
                        </span>
                    </p>
                    <p>
                        <span className="label">Thể loại:</span>
                        <span className="value">
                            {selectDeXuat?.danhSachTheLoai.join(', ') || "Không có"}
                        </span>
                    </p>
                    <p>
                        <span className="label">Tóm tắt:</span>
                        <span className="value">
                            {selectDeXuat?.tomTat || "Không có"}
                        </span>
                    </p>
                    <p>
                        <span className="label">Link:</span>
                        <span className="value">
                            {selectDeXuat?.link || "Không có"}
                        </span>
                    </p>
                    <p>
                        <span className="label">Thời gian:</span>
                        <span className="value"> {selectDeXuat?.thoiGianDeXuat || "Không có"}</span>
                    </p>
                </div>
            </Modal >
        </div >
    )
}

export default DeXuatTruyen;