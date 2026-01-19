/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import TruyenCard from '../../components/TruyenCard';
import CarouselCard from '../../components/CarouselCard';
import s from './styles.module.scss';
import { Carousel, Col, notification, Pagination, Row } from 'antd';
import { POST } from '../../api/baseAPI';

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

function HomePage({ setIsLoading, isAuthenticated }: { setIsLoading: any, isAuthenticated: any }) {
    const navigate = useNavigate();

    const [listBoTruyen, setListBoTruyen] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(1);
    const [theLoai, setTheLoai] = useState(0);
    const [ten, setTen] = useState("");
    const [onSearch, setOnSearch] = useState(0);

    const [listBoTruyenNgauNhien, setListBoTruyenNgauNhien] = useState<any>([]);
    const [theLoaiNgauNhien, setTheLoaiNgauNhien] = useState("MANHWA")
    const [page1, setPage1] = useState(1);
    const [pageSize1, setPageSize1] = useState(8);
    const [total1, setTotal1] = useState(1);

    const [listBoTruyenReview, setListBoTruyenReview] = useState<any>([]);
    const [page2, setPage2] = useState(1);
    const [pageSize2, setPageSize2] = useState(8);
    const [total2, setTotal2] = useState(1);

    const [listBoTruyenGoiY, setListBoTruyenGoiY] = useState<any>([]);

    const handleChangePage = (current: any) => {
        setPage(current);
        setOnSearch(1);
    }

    const handleChangePage1 = (current: any) => {
        setPage1(current);
        DanhSachTruyenTheoTheLoaiNgauNhien(current, 8);
    }

    const handleChangePage2 = (current: any) => {
        setPage2(current);
        DanhSachTruyenReview(current, 8);
    }

    const DanhSachBoTruyen = async (page: any = 1, pageSize: any = 8, ten: any = "", theLoai: any = 0) => {
        setIsLoading(true);
        try {
            var formData = new FormData();

            if (ten !== "")
                formData.append("ten", ten);
            if (theLoai !== 0)
                formData.append("theLoai", String(theLoai));

            formData.append("page", String(page));
            formData.append("pageSize", String(pageSize));
            const response = await POST('api/homepage/quan_ly_truyen/danh_sach_bo_truyen', formData);

            setIsLoading(false);

            if (response?.status === 200) {
                setListBoTruyen(response?.data?.content);
                setTotal(response?.data?.total);
                setOnSearch(0);
            }

        } catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách bộ truyện`,
                duration: 3,
            });
        }
    };

    const DanhSachTruyenTheoTheLoaiNgauNhien = async (page: any = 1, pageSize: any = 8) => {
        setIsLoading(true);
        try {
            var formData = new FormData();

            formData.append("page", String(page));
            formData.append("pageSize", String(pageSize));
            const response = await POST('api/homepage/quan_ly_truyen/danh_sach_bo_truyen', formData);

            setIsLoading(false);

            if (response?.status === 200) {
                setListBoTruyenNgauNhien(response?.data?.content);
                setTotal1(response?.data?.total);
                setTheLoaiNgauNhien("MANHWA");
            }

        } catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách bộ truyện`,
                duration: 3,
            });
        }
    };

    const DanhSachTruyenReview = async (page: any = 1, pageSize: any = 8) => {
        setIsLoading(true);
        try {
            var formData = new FormData();

            formData.append("page", String(page));
            formData.append("pageSize", String(pageSize));
            const response = await POST('api/homepage/quan_ly_truyen/danh_sach_bo_truyen', formData);

            setIsLoading(false);

            if (response?.status === 200) {
                setListBoTruyenReview(response?.data?.content);
                setTotal2(response?.data?.total);
            }

        } catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách bộ truyện`,
                duration: 3,
            });
        }
    };

    const DanhSachTruyenGoiY = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();

            formData.append("page", String(1));
            formData.append("pageSize", String(10));
            const response = await POST('api/homepage/quan_ly_truyen/danh_sach_bo_truyen', formData);

            setIsLoading(false);

            if (response?.status === 200) {
                setListBoTruyenGoiY(response?.data?.content);
            }

        } catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách bộ truyện`,
                duration: 3,
            });
        }
    };

    useEffect(() => {
        if (onSearch === 1) {
            DanhSachBoTruyen(page, pageSize, ten, theLoai);
        }
    }, [onSearch]);

    useEffect(() => {
        DanhSachBoTruyen()
        DanhSachTruyenTheoTheLoaiNgauNhien(1, 8);
        DanhSachTruyenReview(1, 8);
        DanhSachTruyenGoiY();
    }, []);

    return (
        <div className={s.container}>
            {
                isAuthenticated === 'true' && listBoTruyenGoiY.length > 0 && (
                    <>
                        <div className={`${s.title_1} ${s.carousel_none}`}>
                            <h1>TRUYỆN GỢI Ý</h1>
                        </div>

                        <Carousel className={s.carousel_none} arrows dots={false} style={{ width: '1024px' }} slidesToShow={4} autoplay={true}>
                            {listBoTruyenGoiY.map((truyen: any) => (
                                <div key={truyen._id}>
                                    <CarouselCard truyen={truyen} setIsLoading={setIsLoading} />
                                </div>
                            ))}

                        </Carousel>
                    </>
                )
            }

            <div className={s.title_1}>
                <h1>TẤT CẢ TRUYỆN</h1>
            </div>

            <Row
                gutter={[16, 16]}
                justify="center"
                className={s.responsiveGrid}
            >
                {listBoTruyen.map((truyen: any) => (
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={6}
                        key={truyen._id}
                        className={s.responsiveCol}
                    >
                        <TruyenCard key={truyen._id} truyen={truyen} checkVip={false} setIsLoading={setIsLoading} />
                    </Col>
                ))}
            </Row>

            <div className={s.pagination_1}>
                <Pagination
                    className='my-custom-pagination'
                    align='center'
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    onChange={handleChangePage}
                    showSizeChanger={false}
                />
            </div>

            <div className={s.title_1}>
                <h1>TRUYỆN THEO THỂ LOẠI NGẪU NHIÊN</h1>
            </div>

            <div className={s.title_2}>
                <h2>{theLoaiNgauNhien.toUpperCase()}</h2>
            </div>

            <Row
                gutter={[16, 16]}
                justify="center"
                className={s.responsiveGrid}
            >
                {listBoTruyenNgauNhien.map((truyen: any) => (
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={6}
                        key={truyen._id}
                        className={s.responsiveCol}
                    >
                        <TruyenCard key={truyen._id} truyen={truyen} checkVip={false} setIsLoading={setIsLoading} />
                    </Col>
                ))}
            </Row>

            <div className={s.pagination_1}>
                <Pagination
                    className='my-custom-pagination'
                    align='center'
                    current={page1}
                    pageSize={pageSize1}
                    total={total1}
                    onChange={handleChangePage1}
                    showSizeChanger={false}
                />
            </div>

            <div className={s.title_1}>
                <h1>TRUYỆN REVIEW</h1>
            </div>

            <Row
                gutter={[16, 16]}
                justify="center"
                className={s.responsiveGrid}
            >
                {listBoTruyenReview.map((truyen: any) => (
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={6}
                        key={truyen._id}
                        className={s.responsiveCol}
                    >
                        <TruyenCard key={truyen._id} truyen={truyen} checkVip={true} setIsLoading={setIsLoading} />
                    </Col>
                ))}
            </Row>

            <div className={s.pagination_1}>
                <Pagination
                    className='my-custom-pagination'
                    align='center'
                    current={page2}
                    pageSize={pageSize2}
                    total={total2}
                    onChange={handleChangePage2}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
}

export default HomePage;
