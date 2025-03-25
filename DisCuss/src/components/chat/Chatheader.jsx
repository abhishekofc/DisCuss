import { HiX } from "react-icons/hi"; // ✅ React Icons
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../redux/chat/chat.slice.js";

const ChatHeader = ({setIsSidebarOpen}) => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { selectedUser } = useSelector((state) => state.chat);
  const onlineUsers = useSelector((state) => state.user.onlineUsers);

  // ✅ Get first letter, default to "?"
  const firstLetter = selectedUser?.name ? selectedUser.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="p-3  border-b border-gray-700 bg-black text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with fallback */}
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white text-lg font-bold">
            {selectedUser?.avatar ? (
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name || "User"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              firstLetter // Show first letter if avatar is not available
            )}
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-lg font-semibold">
              {selectedUser?.name || "Select a User"}
            </h3>
            <p className="text-sm text-gray-400">
              {selectedUser
                ? onlineUsers?.includes(selectedUser?._id)
                  ? "🟢 Online"
                  : "⚫ Offline"
                : "No user selected"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button onClick={() =>{ dispatch(setSelectedUser(null));
          navigate("/chat")
          setIsSidebarOpen(true)
        }}>
          <HiX className="h-6 w-6 text-gray-400 hover:text-white transition" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
