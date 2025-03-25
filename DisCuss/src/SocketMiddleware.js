import io from "socket.io-client";
import { addMessage } from "./redux/chat/chat.slice.js";

const socket = io(import.meta.env.VITE_API_BASE_URL.replace(/^http/, "ws").replace(/\/api$/, ""), {
  withCredentials: true,
});

// Middleware to handle WebSocket events
export const socketMiddleware = (store) => (next) => (action) => {
  if (action.type === "chat/subscribeToMessages") {
    console.log("🟢 Subscribing to messages...");
    socket.on("newmessage", (message) => {
      console.log("🔴 New Message Received:", message);

      store.dispatch(addMessage({ userId: message.senderId, message }));
    });
  }

  if (action.type === "chat/unsubscribeFromMessages") {
    console.log("🟢 Unsubscribing from messages...");
    socket.off("newmessage");
  }

  return next(action);
};

export default socket;
