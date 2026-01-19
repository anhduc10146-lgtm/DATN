import { io, Socket } from "socket.io-client";
const uri = process.env.REACT_APP_BUILD_MODE_BE === 'production' ? process.env.REACT_APP_API_LIVE : process.env.REACT_APP_API_LOCAL;

// Khởi tạo socket
const socket: Socket = io(uri, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

// Đăng ký các sự kiện toàn cục
const setupGlobalListeners = () => {
    socket.on("global_event", (data) => {
        console.log("Received global event:", data);
        // Xử lý dữ liệu từ sự kiện này
    });

    socket.on("another_event", (data) => {
        console.log("Received another event:", data);
        // Xử lý dữ liệu
    });
};

// Kích hoạt lắng nghe sự kiện toàn cục
setupGlobalListeners();

export default socket;