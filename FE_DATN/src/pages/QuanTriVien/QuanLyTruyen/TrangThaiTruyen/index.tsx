/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Select, InputNumber, notification, QRCode, Table, Modal, Form, Upload, Input, Radio, Space, Tag, Switch, Spin, Tooltip } from "antd";
import { ColumnProps } from "antd/es/table";
import s from './styles.module.scss'
import { GET, POST, POST_FILE } from '../../../../api/baseAPI';
import axios from 'axios';

const { Option } = Select;

const TrangThaiTruyen = ({ setIsLoading }: { setIsLoading: any }) => {
    //Danh sách bộ truyện
    const [page1, setPage1] = useState(1);
    const [pageSize1, setPageSize1] = useState(10);
    const [count1, setCount1] = useState(1);
    const [danhSachBoTruyen, setDanhSachBoTruyen] = useState([]);
    const [ten, setTen] = useState("");
    const [trangThai, setTrangThai] = useState(0);
    const [dataBoTruyen, setDataBoTruyen] = useState<any>(null);
    const [tenBoTruyen, setTenBoTruyen] = useState("");
    const [_idBoTruyen, setIdBoTruyen] = useState("");
    const [soTap, setSoTap] = useState(0);
    const [trangThaiBoTruyen, setTrangThaiBoTruyen] = useState(1);
    const [tomTat, setTomTat] = useState("");
    const [tacGia, setTacGia] = useState("");
    const [theLoai, setTheLoai] = useState([]);
    const [ngayDang, setNgayDang] = useState("");
    const [ngayTao, setNgayTao] = useState("");
    const [thoiGianCapNhat, setThoiGianCapNhat] = useState("");
    const [gioiHanQuyenDoc, setGioiHanQuyenDoc] = useState(0);
    const [gioiHanLuaTuoi, setGioiHanLuaTuoi] = useState(0);
    const [soLuotTruyCap, setSoLuotTruyCap] = useState(0);
    const [giaBanQuyen, setGiaBanQuyen] = useState(0);
    const [giaBan, setGiaBan] = useState(0);
    const [trangBia, setTrangBia] = useState("");
    const [trangBia1, setTrangBia1] = useState("");
    const [listTheLoai, setListTheLoai] = useState([]);

    const [isModalVisible1, setIsModalVisible1] = useState(false);

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear(); // Năm

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }

    const handleCapNhatBoTruyen = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();

            if (trangBia1 !== "") {
                formData.append("trangBia", trangBia1);
            }

            if (theLoai.length === 0) {
                notification.error({
                    message: "Cập nhật bộ truyện",
                    description: "Vui lòng chọn ít nhất 1 thể loại",
                    duration: 3,
                });
                setIsLoading(false);
                return;
            }

            theLoai.forEach((item) => {
                formData.append("theLoai", String(item));
            });

            formData.append("_id", String(_idBoTruyen));
            formData.append("trangThai", String(trangThaiBoTruyen));
            formData.append("tomTat", String(tomTat));
            formData.append("tacGia", String(tacGia));
            formData.append("gioiHanQuyenDoc", String(gioiHanQuyenDoc));
            formData.append("gioiHanLuaTuoi", String(gioiHanLuaTuoi));
            formData.append("soLuotTruyCap", String(soLuotTruyCap));
            formData.append("giaBanQuyen", String(giaBanQuyen));
            formData.append("giaBan", String(giaBan));

            const response = await POST_FILE('api/admin/quan_ly_truyen/cap_nhat_bo_truyen', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                notification.success({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
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
                description: `Lỗi khi cập nhật bộ truyện`,
                duration: 3,
            });
        }
    }

    const handlePageChange1 = (page: any) => {
        DanhSachBoTruyen(page, ten, trangThai);
        setPage1(page);
    };

    const handleSearchBoTruyen = () => {
        setPage1(1);
        DanhSachBoTruyen(1, ten, trangThai);
    }

    const DanhSachBoTruyen = async (page: any = 1, tenSearch: any = "", trangThaiSearch: any = 0) => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            if (tenSearch !== "")
                formData.append("ten", tenSearch);
            if (trangThaiSearch)
                formData.append("trangThai", String(trangThai));

            formData.append("page", String(page));
            formData.append("pageSize", String(pageSize1));
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_bo_truyen_2', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                setCount1(response?.data?.total);
                setDanhSachBoTruyen(response?.data?.content);
                console.log(response?.data?.content)
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

    const handleChiTietBoTruyen = (data: any) => {
        setTenBoTruyen(data.ten);
        setIdBoTruyen(data._id);
        setSoTap(data.soLuongTruyen);
        setTrangThaiBoTruyen(data.trangThai);
        setTomTat(data.tomTat);
        setTacGia(data.tacGia);
        setTheLoai(data.theLoai);
        setNgayDang(data.ngayDang);
        setNgayTao(data.ngayTao);
        setThoiGianCapNhat(data.thoiGianCapNhat);
        setGioiHanQuyenDoc(data.gioiHanQuyenDoc);
        setGioiHanLuaTuoi(data.gioiHanLuaTuoi);
        setSoLuotTruyCap(data.soLuotTruyCap);
        setGiaBanQuyen(data.giaBanQuyen);
        setGiaBan(data.giaBan);
        setTrangBia(data.trangBia);

        setIsModalVisible1(true);
        setDataBoTruyen(data);
    }

    const DanhSachTheLoai = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("page", "1");
            formData.append("pageSize", "1000");
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_the_loai', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                setListTheLoai(response?.data?.content);
            }
        } catch (error) {
            setIsLoading(false)
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách thể loại`,
                duration: 3,
            });
        }
    };

    const handleChangeTheLoai = (value: any) => {
        setTheLoai(value);
    };

    const handleCapNhatTrangThaiTruyen = async (_id: any, trangThai: any) => {
        try {
            setIsLoading(true);
            var formData = new FormData();
            formData.append("_id", _id);
            formData.append("trangThai", String(trangThai));

            const res = await POST('api/admin/quan_ly_truyen/cap_nhat_trang_thai_truyen', formData);

            if (res?.status === 200) {
                const updatedData: any = danhSachBoTruyen.map((item: any) =>
                    item._id === _id ? { ...item, trangThai: (item.trangThai === 1 || item.trangThai === 3) ? 2 : 3 } : item
                );

                notification.success({
                    message: res?.data?.message,
                    description: res?.data?.content,
                    showProgress: true,
                    duration: 3,
                });

                setDanhSachBoTruyen(updatedData);
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
        catch (error: any) {
            setIsLoading(false);
            notification.error({
                message: 'Hệ thống',
                description: 'Có lỗi xảy ra khi cập nhật thông tin',
                duration: 3,
            });
        }
    }

    useEffect(() => {
        DanhSachBoTruyen();
        DanhSachTheLoai();
    }, [])

    //Danh sách tập truyện
    const [boTruyenFocus, setBoTruyenFocus] = useState<any>(null);
    const [tenBoTruyenFocus, setTenBoTruyenFocus] = useState<any>("");

    const [danhSachTapTruyenHienTai, setDanhSachTapTruyenHienTai] = useState<any>([]);
    const [page2, setPage2] = useState(1);
    const [pageSize2, setPageSize2] = useState(10);
    const [count2, setCount2] = useState(1);
    const [idTapTruyen, setIdTapTruyen] = useState("");
    const [soTrang, setSoTrang] = useState(0);
    const [tap, setTap] = useState(0);
    const [url, setUrl] = useState("");
    const [tomTat1, setTomTat1] = useState("");
    const [ngayDang1, setNgayDang1] = useState("");
    const [ngayCapNhat1, setNgayCapNhat1] = useState("");
    const [soLuotTruyCap1, setSoLuotTruyCap1] = useState(0);
    const [trangThai1, setTrangThai1] = useState(2);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [dataTapTruyen, setDataTapTruyen] = useState(null);

    const [danhSachVoice, setDanhSachVoice] = useState<any>([]);
    const [page3, setPage3] = useState(1);
    const [pageSize3, setPageSize3] = useState(10);
    const [count3, setCount3] = useState(1);
    const [idVoice, setIdVoice] = useState("");
    const [tenVoice, setTenVoice] = useState("");
    const [noiDung, setNoiDung] = useState("");
    const [keyVoice, setKeyVoice] = useState(0);
    const [voiceUrl, setVoiceUrl] = useState("");
    const [ngayTao1, setNgayTao1] = useState("");
    const [ngayCapNhat2, setNgayCapNhat2] = useState("");
    const [maBoTruyen, setMaBoTruyen] = useState("");
    const [maTruyen, setMaTruyen] = useState("");
    const [danhSachKeyVoice, setDanhSachKeyVoice] = useState([]);

    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [dataVoice, setDataVoice] = useState(null);

    const DanhSachTapTruyenHienTai = async (page: any = 1, _id: any) => {
        if (!_id) {
            setDanhSachTapTruyenHienTai([]);
            return;
        }
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("idBoTruyen", String(_id));
            formData.append("page", String(page));
            formData.append("pageSize", String(pageSize2));
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_tap_truyen_hien_tai', formData);
            if (response?.status === 200) {
                setDanhSachTapTruyenHienTai(response.data.content);
                setCount2(response.data.total);
            }
            setIsLoading(false);
        } catch (error) {
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách tập truyện`,
                duration: 3,
            });
        }
    }

    const handlePageChange2 = (page: any) => {
        DanhSachTapTruyenHienTai(page, boTruyenFocus);
        setPage2(page);
    };

    const handleChiTietTapTruyen = (data: any) => {
        setIdTapTruyen(data._id);
        setSoTrang(data.soTrang);
        setTap(data.tap);
        setUrl(data.url);
        setTomTat1(data.tomTat);
        setNgayDang1(data.ngayDang);
        setNgayCapNhat1(data.ngayCapNhat);
        setSoLuotTruyCap1(data.soLuotTruyCap);
        setTrangThai1(data.trangThai);

        setIsModalVisible2(true);
        setDataTapTruyen(data);
    }

    const handleDuyetTapTruyen = async (_id: any = "") => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("_id", idTapTruyen);
            formData.append("trangThai", "2");
            const response = await POST('api/admin/quan_ly_truyen/duyet_tap_truyen', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                notification.success({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
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
                message: "Hệ thống",
                description: "Có lỗi xảy ra",
                duration: 3,
            });
        }
    }

    const handleGoTapTruyen = async (_id: any = "") => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("_id", idTapTruyen);
            formData.append("trangThai", "3");
            const response = await POST('api/admin/quan_ly_truyen/duyet_tap_truyen', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                notification.success({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
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
                message: "Hệ thống",
                description: "Có lỗi xảy ra",
                duration: 3,
            });
        }
    }

    const handleXoaTapTruyen = async (_id: any = "") => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("_id", idTapTruyen);
            const response = await POST('api/admin/quan_ly_truyen/xoa_tap_truyen', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                notification.success({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
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
                message: "Hệ thống",
                description: "Có lỗi xảy ra",
                duration: 3,
            });
        }
    }

    const handleCapNhatTapTruyen = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();

            formData.append("_id", String(idTapTruyen));
            formData.append("soTrang", String(soTrang));
            formData.append("tap", String(tap));
            formData.append("url", String(url));
            formData.append("soLuotTruyCap", String(soLuotTruyCap1));
            formData.append("tomTat", String(tomTat1));
            formData.append("ngayDang", String(ngayDang1));

            const response = await POST_FILE('api/admin/quan_ly_truyen/cap_nhat_tap_truyen', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                notification.success({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
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
                description: `Lỗi khi cập nhật tập truyện`,
                duration: 3,
            });
        }
    }

    const DanhSachVoice = async (page: any = 1, _id: any) => {
        if (!_id) {
            setDanhSachVoice([]);
            return;
        }
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("maBoTruyen", String(_id));
            formData.append("page", String(page));
            formData.append("pageSize", String(pageSize3));
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_voice', formData);
            if (response?.status === 200) {
                setDanhSachVoice(response.data.content);
                setCount3(response.data.total);
            }
            setIsLoading(false);
        } catch (error) {
            notification.error({
                message: 'Hệ thống',
                description: `Lỗi khi danh sách tập truyện`,
                duration: 3,
            });
        }
    }

    const DanhSachKeyVoice = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("page", "1");
            formData.append("pageSize", "1000");
            formData.append("trangThai", "1");
            const response = await POST('api/admin/quan_ly_truyen/danh_sach_key_voice', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                setDanhSachKeyVoice(response?.data?.content);
            }
        }
        catch (error) {
            setIsLoading(false);
        }
    }

    const handleChiTietVoice = (data: any) => {
        setIdVoice(data._id);
        setTenVoice(data.ten);
        setNoiDung(data.noiDung);
        setKeyVoice(data.keyVoice);
        setVoiceUrl(data.voiceUrl);
        setNgayTao1(data.ngayTao);
        setNgayCapNhat2(data.ngayCapNhat);
        setMaBoTruyen(data.maBoTruyen);
        setMaTruyen(data.maTruyen);

        setIsModalVisible3(true);
        setDataVoice(data);
    }

    const handlePageChange3 = (page: any) => {
        DanhSachVoice(page, boTruyenFocus);
        setPage3(page);
    };

    const handleKiemTra = async (url: any, ngayCapNhat: any) => {
        try {
            notification.success({
                message: 'Hệ thống kiểm tra',
                description: `Đang tiến hành mở link`,
                duration: 3,
            });
            setTimeout(() => {
                window.open(url, "_blank");
            }, 3000);
        } catch (error) {
            console.log(error);
            notification.error({
                message: 'Hệ thống kiểm tra',
                description: `Có lỗi xảy ra khi kiểm tra link`,
                duration: 3,
            });
        }
    }

    const hanleUpdateVoice = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("_id", idVoice);
            formData.append("ten", tenVoice);
            formData.append("noiDung", noiDung);
            formData.append("keyVoice", String(keyVoice));
            const response = await POST('api/admin/quan_ly_truyen/cap_nhat_voice', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                notification.success({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
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
                message: "Hệ thống",
                description: "Có lỗi xảy ra",
                duration: 3,
            });
        }
    }

    const handleXoaVoice = async () => {
        setIsLoading(true);
        try {
            var formData = new FormData();
            formData.append("_id", idVoice);
            const response = await POST('api/admin/quan_ly_truyen/xoa_voice', formData);
            setIsLoading(false);
            if (response?.status === 200) {
                notification.success({
                    message: response?.data?.message,
                    description: response?.data?.content,
                    duration: 3,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
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
                message: "Hệ thống",
                description: "Có lỗi xảy ra",
                duration: 3,
            });
        }
    }

    useEffect(() => {
        if (boTruyenFocus !== null) {
            DanhSachTapTruyenHienTai(1, boTruyenFocus);
            DanhSachVoice(1, boTruyenFocus);
            DanhSachKeyVoice();
        }
    }, [boTruyenFocus])

    const handleCloseModal = () => {
        setTenBoTruyen("");
        setIdBoTruyen("");
        setSoTap(0);
        setTrangThaiBoTruyen(1);
        setTomTat("");
        setTacGia("");
        setTheLoai([]);
        setNgayDang("");
        setNgayTao("");
        setThoiGianCapNhat("");
        setGioiHanQuyenDoc(0);
        setGioiHanLuaTuoi(0);
        setSoLuotTruyCap(0);
        setGiaBanQuyen(0);
        setGiaBan(0);
        setTrangBia("");
        setTrangBia1("");

        setIdTapTruyen("");
        setSoTrang(0);
        setTap(0);
        setUrl("");
        setTomTat1("");
        setNgayDang1("");
        setNgayCapNhat1("");
        setSoLuotTruyCap1(0);
        setTrangThai1(2);

        setIdVoice("");
        setTenVoice("");
        setNoiDung("");
        setKeyVoice(0);
        setVoiceUrl("");
        setNgayTao1("");
        setNgayCapNhat2("");
        setMaBoTruyen("");
        setMaTruyen("");

        setIsModalVisible3(false);
        setDataVoice(null);

        setIsModalVisible2(false);
        setDataTapTruyen(null);

        setIsModalVisible1(false);
        setDataBoTruyen(null);
    };

    // Cột cho bảng bộ truyện
    const columnsBoTruyen: any = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            width: 60,
            render: (_: any, __any: any, index: any) => (page1 - 1) * 10 + index + 1,
        },
        {
            title: "TÊN BỘ TRUYỆN",
            dataIndex: "ten",
            key: "ten",
            align: "center",
            render: (text: any) => (
                <Tooltip title={text}>
                    <div
                        style={{
                            maxWidth: '156px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {text}
                    </div>
                </Tooltip>
            )
        },
        {
            title: "NGÀY TẢI LÊN",
            dataIndex: "ngayTao",
            key: "ngayTao",
            align: "center",
            render: (ngayTao: any) => formatDate(ngayTao),
        },
        {
            title: "TRẠNG THÁI",
            dataIndex: "trangThai",
            key: "trangThai",
            align: "center",
            render: (trangThai: any) => {
                let color = trangThai === 1 ? 'red' : (trangThai === 2 ? 'green' : 'gold');
                let text = trangThai === 1 ? 'CHỜ DUYỆT' : (trangThai === 2 ? 'PHÁT HÀNH' : 'ĐÃ GỠ');
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "CHI TIẾT",
            dataIndex: "chiTiet",
            key: "chiTiet",
            align: "center",
            render: (_: any, record: any) => <Button onClick={() => handleChiTietBoTruyen(record)} style={{ fontWeight: 'bold', backgroundColor: "#61DAFB", color: "#000", width: '90px' }} variant="solid">CHI TIẾT</Button>
        },
        {
            title: "TÙY CHỌN",
            key: "action",
            render: (text: any, record: any) => (
                <>
                    {(record.trangThai === 1 || record.trangThai === 3) ? (
                        <Button onClick={() => handleCapNhatTrangThaiTruyen(record._id, 2)} style={{ fontWeight: 'bold', backgroundColor: "#05A677", color: "#fff", width: '90px' }} variant="solid">DUYỆT</Button>
                    ) : (
                        <Button onClick={() => handleCapNhatTrangThaiTruyen(record._id, 3)} color="danger" variant="solid" style={{ fontWeight: 'bold', width: '90px' }}>GỠ</Button>
                    )}
                </>
            ),
            align: "center",
        },
    ];

    // Cột cho bảng tập truyện
    const columnsTapTruyen: any = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            width: 60,
            render: (_: any, __any: any, index: any) => (page2 - 1) * 10 + index + 1,
        },
        { title: "TẬP SỐ", dataIndex: "tap", key: "tap", align: "center" },
        {
            title: "TRẠNG THÁI",
            dataIndex: "trangThai",
            key: "trangThai",
            align: "center",
            render: (trangThai: any) => {
                if (trangThai !== 4) {
                    let color = trangThai === 1 ? 'red' : (trangThai === 2 ? 'green' : 'gold');
                    let text = trangThai === 1 ? 'CHỜ DUYỆT' : (trangThai === 2 ? 'HIỂN THỊ' : 'ĐÃ GỠ');
                    return <Tag color={color}>{text}</Tag>;
                }
                else {
                    return <Spin size="small" />;
                }
            },
        },
        {
            title: "CHI TIẾT",
            dataIndex: "chiTiet",
            key: "chiTiet",
            align: "center",
            render: (_: any, record: any) => <Button onClick={() => handleChiTietTapTruyen(record)} style={{ fontWeight: 'bold', backgroundColor: "#61DAFB", color: "#000", width: '90px' }} variant="solid">CHI TIẾT</Button>
        },
    ];

    // Cột cho bảng voice
    const columnsVoice: any = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            width: 60,
            render: (_: any, __any: any, index: any) => (page2 - 1) * 10 + index + 1,
        },
        { title: "TÊN VOICE", dataIndex: "ten", key: "ten", align: "center" },
        {
            title: "TRẠNG THÁI",
            dataIndex: "trangThai",
            key: "trangThai",
            align: "center",
            render: (_: any, record: any) => (
                <Button
                    onClick={() => handleKiemTra(record.voiceUrl, record.ngayCapNhat)}
                    style={{
                        fontWeight: "bold",
                        backgroundColor: "#61DAFB",
                        color: "#000",
                        width: "90px",
                    }}
                    variant="solid"
                >
                    KIỂM TRA
                </Button>
            ),
        },
        {
            title: "CHI TIẾT",
            dataIndex: "chiTiet",
            key: "chiTiet",
            align: "center",
            render: (_: any, record: any) => <Button onClick={() => handleChiTietVoice(record)} style={{ fontWeight: 'bold', backgroundColor: "#61DAFB", color: "#000", width: '90px' }} variant="solid">CHI TIẾT</Button>
        }
    ];

    return (
        <div className={s.personalInfoContainer} style={{ padding: "10px" }}>
            <h1>TRẠNG THÁI TRUYỆN</h1>

            <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gap: '10px', backgroundColor: '#f0f2f5', overflow: 'hidden' }}>
                <div className={s.tableContainer} style={{ overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div className={s.tableHeader}>
                        <h2 className={s.title}>DANH SÁCH BỘ TRUYỆN</h2>
                    </div>
                    <hr className={s.divider} />
                    <Space style={{ margin: '15px 0', display: 'flex', justifyContent: 'start', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
                        <Input
                            placeholder="Nhập tên bộ truyện"
                            value={ten}
                            onChange={(e) => setTen(e.target.value)}
                            style={{ minWidth: '250px' }}
                        />
                        <Select
                            value={trangThai}
                            onChange={(value) => setTrangThai(value)}
                            style={{ minWidth: '150px' }}
                        >
                            <Option value={0}>Tất cả</Option>
                            <Option value={1}>Chờ duyệt</Option>
                            <Option value={2}>Phát hành</Option>
                            <Option value={3}>Đã gỡ</Option>
                        </Select>

                        <Button
                            style={{ padding: "7px", width: '100px', backgroundColor: "#1890ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                            onClick={handleSearchBoTruyen}
                        >
                            Tìm kiếm
                        </Button>
                    </Space>

                    <Table
                        columns={columnsBoTruyen}
                        dataSource={danhSachBoTruyen}
                        scroll={{ x: 840, y: 300 }}
                        pagination={{
                            pageSize: pageSize1,
                            current: page1,
                            total: count1,
                            showSizeChanger: false,
                            onChange: handlePageChange1
                        }}
                        onRow={(record: any) => ({
                            onClick: () => { setBoTruyenFocus(record._id); setTenBoTruyenFocus(record.ten); }
                        })}
                        className="table_2"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', overflowX: 'auto' }}>
                    <div className={s.tableContainer} style={{ width: '400px' }}>
                        <div className={s.tableHeader}>
                            <h2 className={s.title}>DANH SÁCH TẬP TRUYỆN</h2>
                        </div>
                        <hr className={s.divider} />
                        <Table
                            columns={columnsTapTruyen}
                            dataSource={danhSachTapTruyenHienTai}
                            scroll={{ x: 440 }}
                            pagination={{
                                pageSize: pageSize2,
                                current: page2,
                                total: count2,
                                onChange: handlePageChange2
                            }}
                            className="table_2"
                        />
                    </div>

                    <div className={s.tableContainer} style={{ width: '400px' }}>
                        <div className={s.tableHeader}>
                            <h2 className={s.title}>DANH SÁCH VOICE</h2>
                        </div>
                        <hr className={s.divider} />
                        <Table
                            columns={columnsVoice}
                            dataSource={danhSachVoice}
                            scroll={{ x: 440 }}
                            pagination={{
                                pageSize: pageSize3,
                                current: page3,
                                total: count3,
                                onChange: handlePageChange3
                            }}
                            className="table_2"
                        />
                    </div>
                </div>
            </div>

            <Modal
                title={<div style={{ textAlign: 'center' }}>Thông tin bộ truyện</div>}
                visible={isModalVisible1}
                onCancel={handleCloseModal}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button style={{ color: 'white', fontWeight: 'bold' }} type="primary" onClick={handleCapNhatBoTruyen}>
                                Cập nhật
                            </Button>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button style={{ color: 'black', fontWeight: 'bold' }} onClick={handleCloseModal}>
                                Đóng
                            </Button>
                        </div>
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
                {dataBoTruyen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img
                                src={trangBia || "/avatar_image.png"}
                                alt="Avatar"
                                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>ID</label>
                                <Input value={_idBoTruyen || ''} disabled style={{ color: '#000000' }} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Tên</label>
                                <Input disabled value={tenBoTruyen || ''} onChange={(e) => { }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ảnh bìa</label>
                                <Input type="file" accept="image/*" onChange={(e: any) => setTrangBia1(e.target.files[0])} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Số tập</label>
                                <Input disabled type='number' value={soTap || 0} onChange={(e) => { }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Trạng thái</label>
                                <Select style={{ width: '100%' }} value={trangThaiBoTruyen} onChange={(value) => setTrangThaiBoTruyen(value)} >
                                    <Option value={1}>Chờ Duyệt</Option>
                                    <Option value={2}>Phát hành</Option>
                                    <Option value={3}>Gỡ</Option>
                                </Select>
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Tóm tắt</label>
                                <Input value={tomTat || ''} onChange={(e) => setTomTat(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', gap: '10px' }}>
                                <label>Tác giả</label>
                                <Input value={tacGia || ''} onChange={(e) => setTacGia(e.target.value)} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Thể loại</label>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Chọn thể loại"
                                    value={theLoai}
                                    onChange={handleChangeTheLoai}
                                    options={listTheLoai?.map((item: any) => ({
                                        label: item.ten,
                                        value: item.id
                                    }))}
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', gap: '10px' }}>
                                <label>Giới hạn quyền đọc({gioiHanQuyenDoc === 1 ? 'Giới hạn' : 'Không giới hạn'})</label>
                                <Switch checked={gioiHanQuyenDoc === 1} onChange={(checked) => setGioiHanQuyenDoc(checked ? 1 : 0)} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Giới hạn lứa tuổi</label>
                                <Input type='number' value={gioiHanLuaTuoi || 0} onChange={(e) => setGioiHanLuaTuoi(Number(e.target.value))} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Số lượt truy cập</label>
                                <Input type='number' value={soLuotTruyCap || 0} onChange={(e) => setSoLuotTruyCap(Number(e.target.value))} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Giá bản quyền</label>
                                <Input type="number" value={Number(giaBanQuyen) || 0} onChange={(e) => setGiaBanQuyen(Number(e.target.value))} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Giá bán</label>
                                <Input type='number' value={giaBan || 0} onChange={(e) => setGiaBan(Number(e.target.value))} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày đăng</label>
                                <input
                                    type="date"
                                    name="ngaySinh"
                                    value={ngayDang}
                                    disabled
                                    style={{
                                        width: '100%',
                                        padding: '5px 11px',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày tạo</label>
                                <Input value={formatDate(ngayTao) || ''} disabled style={{ color: '#000000' }} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày cập nhật</label>
                                <Input value={formatDate(thoiGianCapNhat) || ''} disabled style={{ color: '#000000' }} />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                title={<div style={{ textAlign: 'center' }}>Thông tin tập truyện</div>}
                visible={isModalVisible2}
                onCancel={handleCloseModal}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {
                                trangThai1 === 3 &&
                                <Button style={{ backgroundColor: '#05A677', color: 'white', fontWeight: 'bold' }} onClick={handleDuyetTapTruyen}>
                                    Duyệt
                                </Button>
                            }
                            {
                                trangThai1 === 2 &&
                                <Button style={{ backgroundColor: '#05A677', color: 'white', fontWeight: 'bold' }} onClick={handleGoTapTruyen}>
                                    Gỡ
                                </Button>
                            }
                            <Button style={{ backgroundColor: '#FF4D4F', color: 'white', fontWeight: 'bold' }} onClick={handleXoaTapTruyen}>
                                Xóa
                            </Button>
                            <Button style={{ color: 'white', fontWeight: 'bold' }} type="primary" onClick={handleCapNhatTapTruyen}>
                                Cập nhật
                            </Button>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button style={{ color: 'black', fontWeight: 'bold' }} onClick={handleCloseModal}>
                                Đóng
                            </Button>
                        </div>
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
                {dataTapTruyen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>ID</label>
                                <Input value={idTapTruyen || ''} disabled style={{ color: '#000000' }} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Số trang</label>
                                <Input type="number" value={soTrang} onChange={(e: any) => setSoTrang(Number(e.target.value))} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Tập</label>
                                <Input type='number' value={tap || 0} onChange={(e) => setTap(Number(e.target.value))} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>URL</label>
                                <Input value={url || ''} onChange={(e) => setUrl(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Số lượt truy cập</label>
                                <Input type='number' value={soLuotTruyCap1 || 0} onChange={(e) => setSoLuotTruyCap1(Number(e.target.value))} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Tên bộ truyện</label>
                                <Input type='text' disabled value={tenBoTruyenFocus || ''} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>

                            <div style={{ flex: '1' }}>
                                <label>Tóm tắt</label>
                                <Input.TextArea
                                    placeholder="Nhập tóm tắt"
                                    maxLength={4500}
                                    rows={5}
                                    value={tomTat1 || ''}
                                    onChange={(e) => setTomTat1(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày đăng</label>
                                <input
                                    type="date"
                                    name="ngaySinh"
                                    value={ngayDang1}
                                    style={{
                                        width: '100%',
                                        padding: '5px 11px',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                    onChange={(e) => setNgayDang1(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày cập nhật</label>
                                <Input value={formatDate(ngayCapNhat1) || ''} disabled style={{ color: '#000000' }} />
                            </div>
                        </div>
                    </div>
                )}
            </Modal >

            <Modal
                title={<div style={{ textAlign: 'center' }}>Thông tin voice</div>}
                visible={isModalVisible3}
                onCancel={handleCloseModal}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button type="primary" onClick={hanleUpdateVoice}>
                                Cập nhật
                            </Button>

                            <Button style={{ backgroundColor: '#FF4D4F', color: 'white', fontWeight: 'bold' }} onClick={handleXoaVoice}>
                                Xóa
                            </Button>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button style={{ color: 'black', fontWeight: 'bold' }} onClick={handleCloseModal}>
                                Đóng
                            </Button>
                        </div>
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
                {dataVoice && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>ID</label>
                                <Input value={idVoice || ''} disabled style={{ color: '#000000' }} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Tên Voice</label>
                                <Input type="text" value={tenVoice} onChange={(e: any) => setTenVoice(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1' }}>
                                <label>Key Voice</label>
                                <Select
                                    value={keyVoice}
                                    onChange={(e: any) => setKeyVoice(e)}
                                    placeholder="Chọn KeyVoice"
                                    style={{ width: '100%' }}
                                >
                                    {danhSachKeyVoice?.map((item: any) => (
                                        <Select.Option key={item.id} value={item.id}>
                                            Key Voice {item.id}: {item.key} ({Number(item.soLuongKyTuConLai)})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1' }}>
                                <label>Trạng thái</label>
                                <Input value={trangThai1 === 0 ? "Không khả dụng" : ((trangThai1 === 1) ? "Đang hoạt động" : "Đang tải lên hoặc lỗi")} disabled />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Nội dung</label>
                                <Input.TextArea
                                    placeholder="Nhập nội dung"
                                    maxLength={4500}
                                    value={noiDung || ''}
                                    rows={5}
                                    onChange={(e: any) => setNoiDung(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày cập nhật</label>
                                <Input value={formatDate(ngayCapNhat2) || ''} disabled style={{ color: '#000000' }} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Ngày tạo</label>
                                <Input value={formatDate(ngayTao1) || ''} disabled style={{ color: '#000000' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Voice Url</label>
                                <Input type='text' value={voiceUrl || ''} />
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>Mã bộ truyện</label>
                                <Input value={maBoTruyen || ''} disabled style={{ color: '#000000' }} />
                            </div>
                        </div>
                    </div>
                )
                }
            </Modal >
        </div >
    );
}

export default TrangThaiTruyen;