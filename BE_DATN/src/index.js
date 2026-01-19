const { server } = require('./config/socket');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const function_tl = require('./services/Hoa_don/functions')

// Chuyển file .env sang dạng sử dụng được để lấy thông tin
require('dotenv').config();

if (process.env.BUILD_MODE === 'dev')
    server.listen(8001, async () => {
        console.log(`Hi ${process.env.AUTHOR}, Truyen tranh 2601 app is running successfully at Host: ${process.env.APP_HOST} and Port: ${process.env.APP_PORT}`);
        await function_tl.resumePendingPayments();
    });
else
    server.listen(process.env.PORT, async () => {
        console.log(`Hi ${process.env.AUTHOR}, Truyen tranh 2601 app is running successfully at Port: ${process.env.PORT}`);
        await function_tl.resumePendingPayments();
    });
