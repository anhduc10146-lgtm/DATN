const path = require('path');
const express = require('express');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
const swaggerUi = require("swagger-ui-express");
const { swaggerJsonData } = require("../../api-docs/swagger");
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

function configureApp(app) {
    app.set('view engine', 'jade');

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../../public')));
    app.use(cors());

    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}

function errorApp(app) {
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}

var AppTruyenTranh2601 = express();

// Cấu hình API dùng cho web truyện tranh 2601
configureApp(AppTruyenTranh2601);
var quanTriVienRouter = require('../../routes/quan_tri_vien.js');
var thanhVienRouter = require('../../routes/thanh_vien.js');
var suDungTruyenRouter = require('../../routes/su_dung_truyen.js');
var toolTruyenTranh2601Router = require('../../routes/tools.js');
var xacThucRouter = require('../../routes/xac_thuc.js');
AppTruyenTranh2601.use('/api/admin', quanTriVienRouter);
AppTruyenTranh2601.use('/api/member', thanhVienRouter);
AppTruyenTranh2601.use('/api/homepage', suDungTruyenRouter);
AppTruyenTranh2601.use('/api/tools', toolTruyenTranh2601Router);
AppTruyenTranh2601.use('/api/authenticate', xacThucRouter);
AppTruyenTranh2601.get('/', (req, res) => { res.send('Deploy successfully') });
errorApp(AppTruyenTranh2601);

// console.log(`App listening at http://localhost:${port}`)
// open(`http://localhost:${port}/api-docs`)

module.exports = AppTruyenTranh2601;