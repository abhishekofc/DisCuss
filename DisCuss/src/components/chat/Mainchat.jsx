import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar.jsx";
import Nochatselected from "./Nochatselected.jsx";  
import Chatcontainer from "./Chatcontainer.jsx";
import { getUsers, getMessages, setSelectedUser } from "../../redux/chat/chat.slice.js";

const Mainchat = () => {
  const dispatch = useDispatch();
  const { users, messages, selectedUser } = useSelector((state) => state.chat);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(isMobile);

  // Detect window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update isSidebarOpen when isMobile changes
  useEffect(() => {
    setIsSidebarOpen(isMobile);
  }, [isMobile]);

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSelectedUser(null)); // Reset selected user on reload
  }, [dispatch]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser?._id && !messages[selectedUser._id]) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [selectedUser, messages, dispatch]);

  return (
    <div className="h-screen bg-base-200 rounded-xl">
      <div className="flex items-center justify-center pt-20 ">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-7xl sm:w-full h-[calc(100vh-6rem)]">
          <div className="flex h-full rounded-lg">
            
            {/* Sidebar - Always Visible on Desktop, Toggles on Mobile */}
            {(isSidebarOpen || !isMobile) && (
              <div className="md:w-80 w-full">
                <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
              </div>
            )}

            {/* Chat Container - Visible when a user is selected on Mobile */}
            {(!isSidebarOpen || !isMobile) && (
              <div className="flex-1 flex w-full">
                {selectedUser ? (
                  <Chatcontainer setIsSidebarOpen={setIsSidebarOpen} />
                ) : (
                  !isMobile && <Nochatselected />
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainchat;
