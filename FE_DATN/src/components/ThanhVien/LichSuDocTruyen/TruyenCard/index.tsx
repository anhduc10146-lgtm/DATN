// TruyenCard.tsx
import React from 'react';
import { Card, Typography, Col } from 'antd';

const { Title, Text } = Typography;


const TruyenCard: any = ({ truyen }: { truyen: any }) => {

    return (
        <Col key={truyen.id} xs={24} sm={12} md={8} lg={6} onClick={() => { window.location.href = `/chi-tiet/${truyen._id}` }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card
                    hoverable
                    cover={<img alt={truyen.ten} src={truyen.trangBia} />}
                    style={{ flex: 1 }} // Đảm bảo Card chiếm hết chiều cao của Col
                >
                    <Title level={4}>{truyen.ten}</Title>
                    <Text><b>Tác giả:</b> {truyen.tacGia}</Text>
                    <br />
                    <Text><b>Thể loại:</b> {truyen.theLoaiString.join(', ')}</Text>
                    <br />
                    <Text><b>Số lượt truy cập:</b> {truyen.soLuotTruyCap}</Text>
                </Card>
            </div>
        </Col>
    );
};

export default TruyenCard;