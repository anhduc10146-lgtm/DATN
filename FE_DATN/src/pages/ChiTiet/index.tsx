/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import TruyenCard from '../../components/TruyenCard';
import CarouselCard from '../../components/CarouselCard';
import s from './styles.module.scss';
import { Button, Carousel, Col, notification, Pagination, Row, Tag } from 'antd';
import { HeartFilled, HeartOutlined, SoundOutlined } from '@ant-design/icons';
import { POST } from '../../api/baseAPI';

function ChiTiet({ setIsLoading, isAuthenticated }: { setIsLoading: any, isAuthenticated: any }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const isAdmin = localStorage.getItem('isAdmin');

    const handleDocTruyen = (tapSo: any) => {
        navigate(`/doc/${id}/${tapSo}`);
    };

    function formatDate(dateString: any) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const [yeuThich, setYeuThich] = useState(false);
    const [thongTinBoTruyen, setThongTinBoTruyen] = useState<any>({});
    const [thongTinTapTruyen, setThongTinTapTruyen] = useState<any>([]);
    const [thongTinVoice, setThongTinVoice] = useState<any>([]);

    const handlePlay = async (url: any) => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("isAdmin", String(isAdmin));
            const response = await POST('api/homepage/quan_ly_truyen/check_vip', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                window.open(url, "_blank");
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
    };

    const toggleYeuThich = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("_id", String(id));
            formData.append("isAdmin", String(isAdmin));
            formData.append("trangThai", yeuThich ? "false" : "true");
            const response = await POST('api/homepage/quan_ly_truyen/danh_dau_yeu_thich', formData);

            setIsLoading(false);

            if (response?.status === 200) {
                setYeuThich(!yeuThich);
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
                description: `Lỗi khi bày tỏ cảm xúc`,
                duration: 3,
            });
        }
    };

    const ChiTietBoTruyen = async (id: any) => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("_id", String(id));
            formData.append("isAdmin", String(isAdmin));
            const response = await POST('api/homepage/quan_ly_truyen/chi_tiet_bo_truyen', formData);

            setIsLoading(false);

            if (response?.status === 200) {
                setThongTinBoTruyen(response?.data?.content[0]);
                setThongTinTapTruyen(response?.data?.content[0].danhSachTruyen);
                setThongTinVoice(response?.data?.content[0].danhSachAmThanh);
                setYeuThich(response?.data?.content[0].yeuThich === 1 ? true : false);
            }

        } catch (error) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách bộ truyện`,
                duration: 3,
            });
        }
    }

    useEffect(() => {
        if (isAuthenticated === 'false') {
            notification.error({
                message: 'Hệ thống',
                description: `Vui lòng đăng nhập để có thể xem thông tin bộ truyện này`,
                duration: 3,
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
        else if (id) {
            ChiTietBoTruyen(id);
        }
    }, [id]);

    return (
        <div className={s.container}>
            <div className={s.title_1}>
                <h1>CHI TIẾT TRUYỆN</h1>
            </div>
            <div className={s.content}>
                <div className={s.left}>
                    <img src={thongTinBoTruyen?.trangBia} alt={thongTinBoTruyen.ten} className={s.cover_image} />
                </div>
                <div className={s.right}>
                    <h1>{thongTinBoTruyen?.ten}</h1>
                    <p><strong>Tác giả:</strong> {thongTinBoTruyen?.tacGia || "Chưa cập nhật"}</p>
                    <p><strong>Số tập:</strong> {thongTinBoTruyen?.soTap}</p>
                    <p><strong>Ngày đăng:</strong> {formatDate(thongTinBoTruyen?.ngayDang)}</p>
                    <p><strong>Tóm tắt:</strong> {thongTinBoTruyen?.tomTat}</p>
                    <p><strong>Giới hạn lứa tuổi:</strong> {thongTinBoTruyen?.gioiHanLuaTuoi}</p>
                    <p><strong>Số lượt truy cập:</strong> {thongTinBoTruyen?.soLuotTruyCap}</p>
                    <p><strong>Đọc đến tập:</strong> {thongTinBoTruyen?.daDoc}</p>
                    <p><strong>Thể loại:</strong></p>
                    <div>
                        {thongTinBoTruyen?.theLoaiString?.map((theLoai: any, index: any) => (
                            <Tag key={index} style={{ backgroundColor: "transparent", border: '1px solid #F18121', color: '#F18121', marginBottom: '10px' }}>
                                {theLoai}
                            </Tag>
                        ))}
                    </div>
                    <Button
                        type="text"
                        onClick={toggleYeuThich}
                        style={{
                            backgroundColor: yeuThich ? 'lightgreen' : 'lightblue',
                        }}
                    >
                        {yeuThich ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined style={{ color: 'white' }} />}
                    </Button>
                </div>
            </div>

            <div className={s.action}>
                <div className={s.leftAction}>
                    <h2>Danh sách các tập truyện</h2>
                    <ul>
                        {thongTinTapTruyen.map((tap: any) => (
                            <li style={{ cursor: 'pointer' }} key={tap.soTap} onClick={() => handleDocTruyen(tap.tap)}>Tập {tap.tap}</li>
                        ))}
                    </ul>
                </div>
                <div className={s.rightAction}>
                    <h2>Danh sách âm thanh</h2>
                    <ul>
                        {thongTinVoice?.map((item: any) => (
                            <li key={item.ten} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ color: '#20B2AA' }}>{item.ten}</span>

                                <SoundOutlined
                                    onClick={() => handlePlay(item.voiceUrl)}
                                    style={{ marginLeft: '10px', cursor: 'pointer', fontSize: '18px', color: '#F18121' }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ChiTiet;