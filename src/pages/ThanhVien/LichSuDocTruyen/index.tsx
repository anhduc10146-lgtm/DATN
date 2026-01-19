/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Card, Col, notification, Row, Typography } from "antd";
import TruyenCard from '../../../components/ThanhVien/LichSuDocTruyen/TruyenCard';
import s from "./styles.module.scss";
import { POST } from "../../../api/baseAPI";

const { Title, Text } = Typography;

const LichSuDocTruyen = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
    const [listTruyenYeuThich, setListTruyenYeuThich] = useState<any>([]);

    const DanhSachTruyenYeuThich = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            const response = await POST('api/homepage/quan_ly_truyen/danh_sach_truyen_yeu_thich', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                setListTruyenYeuThich(response?.data?.content);
            }
            else {
                notification.error({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
            }
        } catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi kiểm tra thông tin thành viên`,
                duration: 3,
            });
        }
    }
    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h1 className={s.title}>
                LỊCH SỬ ĐỌC TRUYỆN
            </h1>
            <Row gutter={[16, 16]}>
                {[].map((truyen: any) => (
                    <TruyenCard key={truyen.id} truyen={truyen} />
                ))}
            </Row>
        </div>
    );
};

export default LichSuDocTruyen;
