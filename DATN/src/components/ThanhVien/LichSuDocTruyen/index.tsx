// TruyenCard.tsx
import React from 'react';
import { Card, Typography, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import s from './styles.module.scss';
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

const TruyenCard: React.FC<TruyenProps> = ({ truyen }) => {
    const navigate = useNavigate();
    const handleDetailClick = () => {
        navigate(`/chi-tiet/idBoTruyen`);
    };
    return (
        <Card
            hoverable
            cover={<img alt={truyen.ten} src={truyen.trangBia || '/truyen_loading.png'} className={s.coverImage} />}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
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

export default TruyenCard;