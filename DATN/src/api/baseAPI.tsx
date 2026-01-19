import { notification } from "antd";
import axios from "axios";

const api = process.env.REACT_APP_BUILD_MODE_BE === 'production' ? process.env.REACT_APP_API_LIVE : process.env.REACT_APP_API_LOCAL;

export const getCurrentToken = async () => {
    let currentAccessToken = localStorage.getItem("access_token");

    // if (!currentAccessToken) {
    //     await SignIn();
    //     currentAccessToken = getCookie("access_token");
    // }

    return currentAccessToken;
};

export const SignIn = async () => {
    const body = {
        account: '',
        password: '',
        isAdmin: true,
    }
    try {
        const res = await axios.post(
            `${api}/api/authenticate/dang_nhap`,
            body
        )

        if (res?.status === 200) {
            const access_token = res?.data?.data?.data?.access_token;
            localStorage.setItem('access_token', access_token)
        }
    } catch (error) { console.log(error) }
};

export const GET = async (url: string) => {
    const currentToken = await getCurrentToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
        }
    };

    try {
        const res = await axios.get(`${api}/${url}`, {
            ...config,
            validateStatus: (status) => {
                return status >= 200 && status <= 403;
            }
        });
        if (res?.status === 200) {
            return res;
        }
        else if (res?.status === 403) {
            notification.error({
                message: 'Hệ thống',
                description: `Phiên đăng nhập đã hết hạn`,
                duration: 3,
            });
            setTimeout(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('ten');
                localStorage.removeItem('anhDaiDien');
                localStorage.setItem('isAuthenticated', 'false');
                window.location.href = "/login";
            }, 3000);
            return res;
        }
        else if (res?.status === 401) {
            notification.error({
                message: 'Hệ thống',
                description: `Mã lỗi 401`,
                duration: 3,
            });
            return res;
        }
        else if (res?.status === 400) {
            notification.error({
                message: 'Hệ thống',
                description: `Mã lỗi 400`,
                duration: 3,
            });
            return res;
        }
        else {
            notification.error({
                message: 'Hệ thống',
                description: `${res?.status}`,
                duration: 3,
            });
            return null;
        }
    } catch (error: any) {
        console.log(error?.message);
        if (error?.message === 'Network Error') {
            notification.error({
                message: 'Hệ thống',
                description: `Mất kết nối đến server backend`,
                duration: 3,
            });
        }
        return error.response;
    }
};

export const POST = async (url: string, body: any) => {
    const currentToken = await getCurrentToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
        }
    };

    try {
        const res: any = await axios.post(`${api}/${url}`, body, {
            ...config,
            validateStatus: (status) => {
                return status >= 200 && status <= 403;
            }
        });
        if (res?.status === 200) {
            return res;
        }
        else if (res?.status === 403) {
            notification.error({
                message: 'Hệ thống',
                description: `Phiên đăng nhập đã hết hạn`,
                duration: 3,
            });
            setTimeout(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('ten');
                localStorage.removeItem('anhDaiDien');
                localStorage.setItem('isAuthenticated', 'false');
                window.location.href = "/login";
            }, 3000);
            return res;
        }
        else if (res?.status === 401) {
            console.log("Lỗi 401: Chưa xác thực.");
            return res;
        }
        else if (res?.status === 400) {
            console.log("Lỗi 400: Yêu cầu không hợp lệ.");
            return res;
        }
        else if (res?.status === 500) {
            console.log("Lỗi 500: Lỗi không xác định.");
            return res?.response;
        }
        else {
            console.log("Lỗi:", res?.status);
            return null;
        }
    } catch (error: any) {
        console.log(error?.message);
        if (error?.message === 'Network Error') {
            notification.error({
                message: 'Hệ thống',
                description: `Mất kết nối đến server backend`,
                duration: 3,
            });
        }
        return error?.response;
    }
};

export const POST_FILE = async (url: string, body: any) => {
    const currentToken = await getCurrentToken();

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken}`,
        }
    };

    try {
        const res: any = await axios.post(`${api}/${url}`, body, {
            ...config,
            validateStatus: (status) => {
                return status >= 200 && status <= 403;
            }
        });
        if (res?.status === 200) {
            return res;
        }
        else if (res?.status === 403) {
            notification.error({
                message: 'Hệ thống',
                description: `Phiên đăng nhập đã hết hạn`,
                duration: 3,
            });
            setTimeout(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('ten');
                localStorage.removeItem('anhDaiDien');
                localStorage.setItem('isAuthenticated', 'false');
                window.location.href = "/login";
            }, 3000);
            return res;
        }
        else if (res?.status === 401) {
            console.log("Lỗi 401: Chưa xác thực.");
            return res;
        }
        else if (res?.status === 400) {
            console.log("Lỗi 400: Yêu cầu không hợp lệ.");
            return res;
        }
        else if (res?.status === 500) {
            console.log("Lỗi 500: Lỗi không xác định.");
            return res?.response;
        }
        else {
            console.log("Lỗi:", res?.status);
            return null;
        }
    } catch (error: any) {
        console.log(error?.message);
        if (error?.message === 'Network Error') {
            notification.error({
                message: 'Hệ thống',
                description: `Mất kết nối đến server backend`,
                duration: 3,
            });
        }
        return error?.response;
    }
};