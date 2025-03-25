import { FaRegCommentAlt } from "react-icons/fa";

export default function NoChatSelected() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-300">
      <div className="text-center space-y-6">
        {/* Icon Section */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gray-700 p-4 flex items-center justify-center">
              <FaRegCommentAlt className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold text-white">Welcome to Chatty!</h2>
        <p className="text-gray-400 text-base">
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>
    </div>
  );
}
