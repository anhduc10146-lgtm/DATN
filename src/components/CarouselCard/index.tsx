// TruyenCard.tsx
import React from 'react';
import { Card, Typography, Col, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import s from './styles.module.scss';
import { POST } from '../../api/baseAPI';
const { Title, Text } = Typography;

// Định nghĩa kiểu dữ liệu cho props
interface TruyenProps {
    truyen: {
        idBoTruyen: string;
        ten: string;
        trangBia: string;
        soLuotTruyCap: number;
    };
}

const CarouselCard = ({ truyen, setIsLoading }: { truyen: any, setIsLoading: any }) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    const handleDetailClick = async () => {
        if (isAuthenticated === 'false') {
            notification.error({
                message: 'Hệ thống',
                description: `Vui lòng đăng nhập để có thể xem thông tin truyện`,
                duration: 3,
            });
            return;
        }
        else {
            setIsLoading(true);
            try {
                var formData = new FormData();

                formData.append("_id", String(truyen._id));

                const response = await POST('api/homepage/quan_ly_truyen/tang_so_luot_truy_cap', formData);

                if (response?.status === 200) {
                    navigate(`/chi-tiet/${truyen._id}`);
                }
                else {
                    notification.error({
                        message: response?.data?.message,
                        description: response?.data?.content,
                        duration: 3,
                    });
                }

                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                notification.error({
                    message: 'Hệ thống',
                    description: error.message,
                    duration: 3,
                });
            }
        }
    };
    return (
        <Card
            hoverable
            cover={<img alt={truyen.ten} src={truyen.trangBia || '/truyen_loading.png'} className={s.coverImage} />}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '240px' }}
            className={s.card}
        >
            <div className={s.footer}>
                <Text className={s.title}>{truyen.ten}</Text>
                <Button onClick={handleDetailClick} className={s.button}>
                    Đọc truyện
                </Button>
            </div>
            <Text className={s.subInfo}>
                {truyen.soLuotTruyCap || 0} lượt truy cập
            </Text>
        </Card>
    );
};

export default CarouselCard;