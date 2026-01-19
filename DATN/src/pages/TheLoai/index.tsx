/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import TruyenCard from '../../components/TruyenCard';
import CarouselCard from '../../components/CarouselCard';
import s from './styles.module.scss';
import { Carousel, Col, Pagination, Row } from 'antd';

const fakeData1 = [
    {
        idBoTruyen: '1',
        ten: 'Dragon Ball Rise',
        trangBia: 'http://localhost:8001/Bo_truyen/2024/12/20/1734653934592_dragon_ball_rise.jpg',
        soLuotTruyCap: 1000
    },
    {
        idBoTruyen: '2',
        ten: 'Độc thủ vũ y',
        trangBia: 'http://localhost:8001/Bo_truyen/2024/12/20/1734653934646_doc_thu_vu_y.jpg',
        soLuotTruyCap: 500
    },
    {
        idBoTruyen: '3',
        ten: 'Dragon Ball Mutiverse',
        trangBia: 'http://localhost:8001/Bo_truyen/2024/12/20/1734653934696_dragon_ball_mutiverse.jpg',
        soLuotTruyCap: 2000
    },
    {
        idBoTruyen: '4',
        ten: 'Jiren vs broly',
        trangBia: 'http://localhost:8001/Bo_truyen/2024/12/20/1734653934780_jiren_vs_broly.jpg',
        soLuotTruyCap: 1200
    },
    {
        idBoTruyen: '5',
        ten: 'Onepunchman',
        trangBia: 'http://localhost:8001/Bo_truyen/2024/12/20/1734653934780_jiren_vs_broly.jpg',
        soLuotTruyCap: 1200
    },
    {
        idBoTruyen: '6',
        ten: 'Ta là Hàn Tam Thiên',
        trangBia: 'http://localhost:8001/Bo_truyen/2024/12/20/1734653934864_ta_la_han_tam_thien.jpg',
        soLuotTruyCap: 1200
    },
    {
        idBoTruyen: '7',
        ten: 'Ta ở nhà 100 năm',
        trangBia: 'http://localhost:8001/Bo_truyen/2024/12/20/1734653934911_ta_o_nha_100_nam_khi_ra_ngoai_da_vo_dich.jpg',
        soLuotTruyCap: 1200
    },
    {
        idBoTruyen: '8',
        ten: 'Tiên tôn lạc vô cực',
        trangBia: 'http://localhost:8001/Bo_truyen/2024/12/20/1734653934950_tien_ton_lac_vo_cuc.jpg',
        soLuotTruyCap: 1200
    }
];

function TheLoai() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };

    const [truyenList, setTruyenList] = useState(fakeData1);

    useEffect(() => {
        // You can fetch real data here and update the state
    }, []);

    return (
        <div className={s.container}>

            <div className={`${s.title_1} ${s.carousel_none}`}>
                <h1>TRUYỆN GỢI Ý</h1>
            </div>

            <Carousel className={s.carousel_none} dots={false} style={{ width: '1024px' }} slidesToShow={4} autoplay={true}>
                {truyenList.map((truyen) => (
                    <div key={truyen.idBoTruyen}>
                        <CarouselCard truyen={truyen} setIsLoading={() => { }} />
                    </div>
                ))}

            </Carousel>

            <div className={s.title_1}>
                <h1>MANHWA</h1>
            </div>

            <Row
                gutter={[16, 16]}
                justify="center"
                className={s.responsiveGrid}
            >
                {truyenList.slice(0, 8).map((truyen) => (
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={6}
                        key={truyen.idBoTruyen}
                        className={s.responsiveCol}
                    >
                        <TruyenCard key={truyen.idBoTruyen} truyen={truyen} />
                    </Col>
                ))}
            </Row>

            <div className={s.pagination_1}>
                <Pagination align="center" defaultCurrent={1} total={50} />
            </div>
        </div>
    );
}

export default TheLoai;
