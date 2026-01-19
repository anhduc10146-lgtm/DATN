/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import s from './styles.module.scss';
import { BackTop, Button, Carousel, Col, FloatButton, notification, Pagination, Row, Select } from 'antd';
import { url } from 'inspector';
import { POST } from '../../api/baseAPI';

const { Option } = Select;

interface Truyen {
    ten: string;
    tap: number[];
    anh: string[];
}

function DocTruyen({ setIsLoading }: { setIsLoading: any }) {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('isAdmin');
    const { idBoTruyen, tapSo } = useParams();
    const [selectedTap, setSelectedTap] = useState(null);
    const [listTruyenHienThi, setListTruyenHienThi] = useState<any>([]);
    const [ten, setTen] = useState("");
    const [tap, setTap] = useState(0);
    const [listTrang, setListTrang] = useState<any>([]);

    const handleNgheTruyen = () => {
        window.location.href = `/chi-tiet/${idBoTruyen}`;
    }

    const handleChange = (value: any) => {
        setSelectedTap(value);
    };

    const DanhSachTrangTruyen = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("isAdmin", String(isAdmin));
            formData.append("idBoTruyen", String(idBoTruyen));
            formData.append("tap", String(tapSo));
            const response = await POST('api/homepage/quan_ly_truyen/danh_sach_trang_truyen', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                setSelectedTap(response?.data?.content[0].tap);
                setTen(response?.data?.content[0].ten);
                setTap(response?.data?.content[0].tap)
                setListTrang(response?.data?.content[0].danhSachTrangTruyen.sort((a: any, b: any) => {
                    const numA = parseInt(a.name.split('.')[0], 10);
                    const numB = parseInt(b.name.split('.')[0], 10);
                    return numA - numB;
                }));
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

    const DanhSachTapTruyenHienThi = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("idBoTruyen", String(idBoTruyen));
            const response = await POST('api/homepage/quan_ly_truyen/danh_sach_tap_truyen_hien_thi', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                setListTruyenHienThi(response?.data?.content);
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
                description: `Lỗi khi lấy danh sách truyện hiển thị`,
                duration: 3,
            });
        }
    }

    useEffect(() => {
        if (idBoTruyen && tapSo) {
            DanhSachTrangTruyen()
            DanhSachTapTruyenHienThi();
        }
    }, [idBoTruyen, tapSo]);

    useEffect(() => {
        if (selectedTap !== null && selectedTap !== tap && tap !== 0) {
            window.location.href = `/doc/${idBoTruyen}/${selectedTap}`
        }
    }, [selectedTap]);

    return (
        <div className={s.container}>
            <FloatButton.BackTop />
            <div className={s.title_1}>
                <h1>{ten || ""} - {"Tập" + tap || ""}</h1>
            </div>
            <div className={s.select_container}>
                <Select
                    defaultValue="Chọn tập"
                    style={{ width: 200 }}
                    onChange={handleChange}
                >
                    {listTruyenHienThi.map((data: any) => (
                        <Option key={tap} value={data.tap}>Tập {data.tap}</Option>
                    ))}
                </Select>
                <Button type="primary" onClick={handleNgheTruyen} className={s.listen_button}>
                    NGHE TRUYỆN
                </Button>
            </div>

            <div className={s.image_gallery}>
                {listTrang?.length > 0 && listTrang?.map((item: any, index: any) => (
                    <img key={index} src={`https://drive.google.com/thumbnail?id=${item.id}&sz=w1000`} alt={`Hình ảnh ${index + 1}`} className={s.story_image} />
                ))}
            </div>
        </div>
    );
}

export default DocTruyen;