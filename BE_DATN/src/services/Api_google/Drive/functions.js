const functions = require('../../functions')

//Kết nối đến drive
exports.createConfigDrive = () => {
    const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = functions.getConfigGroup('driveConfig');
    return { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN }
}


