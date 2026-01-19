/******************************************************************** 
*                                                                   *
*   *
*                                                                   *
* File này chạy riêng không liên quan gì đến file main.js           *
*                                                                   *
*********************************************************************/

const functions = require('../services/functions');
const functions_drive = require('../services/Api_google/Drive/functions');
const functions_mail = require('../services/Api_google/Mail/functions')
require('dotenv').config();

exports.seed = async function (data) {
    try {
        config = {
            driveConfig: {
                CLIENT_ID: "",
                CLIENT_SECRET: "",
                REDIRECT_URI: "",
                REFRESH_TOKEN: ""
            },
            mailConfig: {
                CLIENT_ID: "",
                CLIENT_SECRET: "",
                REDIRECT_URI: "",
                REFRESH_TOKEN: ""
            },
            AUTH_EMAIL: ""
        }

        //Khởi tạo lại các key trong config.json
        const existingConfig = functions.getAllConfig();
        if (!existingConfig || Object.keys(existingConfig).length === 0 || data?.newConfigFile == "true") {
            console.log('Initializing...');
            functions.initConfig(config);
            console.log('Khởi tạo lại file config.json thành công');
        }

        let allConnected = true;
        const isConnectedDrive = await functions.checkConnectionDrive();
        const isConnectedMail = await functions.checkConnectionMail();

        if (isConnectedMail) {
            console.log('Kết nối đến Mail thành công!');
        } else {
            console.error('Kết nối đến Mail thất bại.');
            allConnected = false;
        }

        if (isConnectedDrive) {
            console.log('Kết nối đến Google Drive thành công!');
        } else {
            console.error('Kết nối đến Google Drive thất bại.');
            allConnected = false;
        }

        return allConnected;
    }
    catch (err) {
        console.log('Lỗi Key Api Google Seed: ', err, '\n Lỗi Key Api Google Seed');
        return false;
    }
}



