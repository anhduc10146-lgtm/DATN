const functions = require('../../functions')
const { google } = require('googleapis');

//Kết nối đến drive
exports.createConfigMail = async () => {
    try {
        const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = functions.getConfigGroup('mailConfig');
        const oath2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oath2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const accessToken = await oath2Client.getAccessToken();

        if (!accessToken || !accessToken.token) {
            throw new Error('Không thể lấy được access token. Token có thể đã hết hạn hoặc bị thu hồi.');
        }

        const mailConfig = {
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: '',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        }

        return mailConfig;
    }
    catch (err) {
        console.error("Lỗi khi tạo cấu hình mail: ", err.message);
        return null;
    }
}

//Lấy tài khoản mail đã đăng ký ở trên
exports.getMail = () => {
    try {
        const mail = functions.getConfigGroup('AUTH_EMAIL');
        return mail;
    }
    catch (err) {
        console.error("Lỗi lấy mail: ", err.message);
        return null;
    }
}

