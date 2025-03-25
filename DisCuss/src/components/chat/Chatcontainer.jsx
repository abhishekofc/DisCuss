import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../../redux/chat/chat.slice";
import Chatheader from "./Chatheader.jsx";
import Messageinput from "./Messageinput.jsx";
import MessageSkeleton from "./MessageSkeleton.jsx";

const Chatcontainer = ({setIsSidebarOpen}) => {
  const dispatch = useDispatch();
  const { messages, selectedUser, isMessagesLoading } = useSelector(
    (state) => state.chat
  );
  const loggedInUser = useSelector((state) => state.user.user);
  const messagesEndRef = useRef(null);

  // Auto-scroll when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages[selectedUser?._id]]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [selectedUser, dispatch]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col text-white bg-[#0d0d0d]">
        <Chatheader />
        <MessageSkeleton />
        <Messageinput />
      </div>
    );
  }

  const userMessages =
    selectedUser && messages[selectedUser._id] ? messages[selectedUser._id] : [];

  return (
    <div className="flex-1 flex flex-col rounded-xl text-white bg-[#0d0d0d] scrollbar-thin scrollbar-thumb-gray-500" style={{ backgroundImage: "url(https://i.pinimg.com/736x/5a/11/bb/5a11bb1d77ee734b4f16ad3b2d6bc189.jpg)", backgroundSize: "contain",  }}>
      <Chatheader setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Chat Background */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 ">
        {userMessages.length > 0 ? (
          userMessages.map((msg) => {
            const isFromMe = msg.senderId === loggedInUser._id;
            const bubbleBg = isFromMe ? "bg-[#3A3F47] text-white" : "bg-[#252525] text-gray-300";
            const alignment = isFromMe ? "justify-end" : "justify-start";
            const textAlign = isFromMe ? "text-right" : "text-left";
            
            return (
              <div key={msg._id} className={`flex items-end ${alignment} group`}>
                {!isFromMe && (
                  <img
                    src={selectedUser?.avatar || "/avatar.png"}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full mr-2"
                  />
                )}

                {/* Chat Bubble */}
                <div
                  className={`rounded-xl p-3 max-w-xs text-white break-words shadow-md ${bubbleBg} ${textAlign} transition-transform group-hover:scale-[1.02]`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="message-img"
                      className="w-40 h-40 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm">{msg.text}</p>
                  <small className="text-[10px] flex items-end justify-end text-gray-400 leading-none">
                    {new Date(msg.createdAt).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // 12-hour format
                    })},{" "}
                    {new Date(msg.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </small>


                </div>

                {isFromMe && (
                  <img
                    src={loggedInUser?.avatar || "/avatar.png"}
                    alt="My Avatar"
                    className="w-9 h-9 rounded-full ml-2"
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <Messageinput />
    </div>
  );
};

export default Chatcontainer;
