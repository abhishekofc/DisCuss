import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/user/user.slice.js";
import { addMessage } from "./redux/chat/chat.slice.js"; // ✅ Import chat action
import { getSocket, connectSocket } from "../socket.js";

const SocketListener = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      console.log("⚠️ No user found. Socket connection will not be established.");
      return;
    }

    let socket = getSocket();
    
    if (!socket) {
      connectSocket({ userId: user._id }); // 🔄 Reconnect if socket is missing
      socket = getSocket();
    }
    
    if (!socket) {
      console.log("⚠️ Still no active socket connection.");
      return;
    }

    // ✅ Listen for new messages
    socket.on("newmessage", (message) => {
      console.log("📩 New message received via socket:", message);
      
      // ✅ Dispatch action to update Redux store
      dispatch(addMessage({ userId: message.senderId, message }));
    });

    // ✅ Listen for online users
    socket.on("setOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    // Cleanup function to prevent memory leaks
    return () => {
      socket.off("newmessage");  // ✅ Remove listener when component unmounts
      socket.off("setOnlineUsers");
    };
  }, [user, dispatch]);

  return null; // ✅ This component doesn't render anything
};

export default SocketListener;
