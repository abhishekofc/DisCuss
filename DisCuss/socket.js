import { io } from "socket.io-client";

let socket = null;

export const connectSocket = ({ userId }) => {
    if (!socket || !socket.connected) {
        socket = io(import.meta.env.VITE_API_BASE_URL.replace(/^http/, "ws").replace(/\/api$/, ""), {
            query: { userId },
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("✅ Connected to socket server, ID:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected from socket server");
        });

        // ❌ Don't dispatch Redux actions here
        socket.on("setOnlineUsers", (users) => {
            console.log("🟢 Received online users:", users);
        });
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;
