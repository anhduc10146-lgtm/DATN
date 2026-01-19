const Truyen = require('../../models/Truyen');

const functions = require('../functions');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = functions.getConfigGroup('driveConfig');
const { google } = require('googleapis');

//Kết nối đến drive
const oath2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oath2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    version: 'v3',
    auth: oath2Client
})

exports.getLinkTruyenDrive = async (url) => {
    try {
        let list_img_chap = []
        if (url != "" && url != undefined && url != null) {
            let file_info = await drive.files.list({
                q: `'${url}' in parents`,
            })
                .then((data) => {
                    return data.data.files;
                })
                .catch((error) => {
                    console.error('Lỗi:', error.response.data);
                    return [];
                });
            for (let i = 0; i < file_info.length; i++) {
                let item = file_info[i];
                let name = item.name;
                let id = item.id;
                let url_link = await functions.getLinkPublicDrive(id);
                list_img_chap.push({ name: name, url_link: url_link });
            }

        }
        return list_img_chap;
    }
    catch (error) {
        console.log("Lỗi khi lấy danh sách link các trang trong 1 tập")
        return []
    }
}