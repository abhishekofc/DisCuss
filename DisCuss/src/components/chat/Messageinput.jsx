import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "./../../redux/chat/chat.slice.js"; // Adjust the path as needed
import { RiAttachment2, RiSendPlane2Fill, RiAddCircleFill } from "react-icons/ri"; // React Icons

const MessageInput = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const { selectedUser } = useSelector((state) => state.chat);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const isMessageSending = useSelector((state) => state.chat.isMessageSending);
  
  // Handle Text Input Change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      setFile(selectedFile); // Store the file
  
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target.result); // Set preview image
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setImagePreview(null); // Clear preview for non-image files
      }
    }
  };

  // Handle Send Message
  const handleSendMessage = async () => {
    if (!selectedUser) {
      alert("Please select a user to send a message.");
      return;
    }
    if (!text.trim() && !file) return; // Prevent empty messages

    const messageData = { userId: selectedUser._id, text: text, file };

    dispatch(sendMessage(messageData)).then((res) => {
      if (!res.error) {
        setText(""); // Clear text input
        setFile(null); // Clear file
        setImagePreview(null); // Remove preview
      }
    });
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-[#222] border-t border-gray-700 rounded-xl">
      {/* File Input (Hidden) */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      {/* Plus Icon for Adding File */}
      <button
        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition flex items-center justify-center"
        onClick={() => fileInputRef.current.click()}
        disabled={isMessageSending}
      >
        <RiAddCircleFill size={24} className="text-white" />
      </button>

      {/* Image Preview (if selected) */}
      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-16 h-16 rounded-lg border border-gray-600 object-cover"
          />
          <button
            className="absolute top-[-5px] right-[-5px] bg-black text-white rounded-full p-1 text-xs"
            onClick={() => {
              setFile(null);
              setImagePreview(null);
            }}
          >
            ❌
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="flex-1 relative">
        <textarea
          className="w-full p-3 bg-[#333] text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
          rows="1"
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={isMessageSending}
          style={{ minHeight: "40px", maxHeight: "80px", overflowY: "auto" }}
        />
      </div>

      {/* Send Button */}
      <button
        className={`p-3 bg-blue-500 text-white rounded-full  transition flex items-center ${isMessageSending? `bg-blue-200`:``} justify-center`}
        onClick={handleSendMessage}
        disabled={isMessageSending}
      >
        <RiSendPlane2Fill size={24} />
      </button>
    </div>
  );
};

export default MessageInput;