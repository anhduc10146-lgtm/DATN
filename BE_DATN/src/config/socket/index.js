const http = require('http');
const { Server } = require('socket.io');
const AppTruyenTranh2601 = require('../app');

// Hàm khởi tạo server
const server = http.createServer(AppTruyenTranh2601);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

exports.emit = (ev, args) => {
    io.emit(ev, args);
}

module.exports = { server };