import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setSelectedUser } from "../../redux/chat/chat.slice.js";
import { useNavigate } from "react-router-dom";
import Sidebarskeleton from "./Sidebarskeleton";
import { FaUsers } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const Sidebar = ({setIsSidebarOpen}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isUsersLoading, selectedUser } = useSelector((state) => state.chat);
  const onlineUsers = useSelector((state) => state.user.onlineUsers);

  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleUserClick = (user) => {
    dispatch(setSelectedUser(user));
    setIsSidebarOpen(false)
  
  };
  

  // Filter users by both name and email
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers([]);
    } else {
      const results = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(results);
    }
  }, [search, users]);

  if (isUsersLoading) return <Sidebarskeleton />;

  return (
    <aside className="lg:w-96 rounded-xl h-full border-r bg-[#1a1a1a] flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="border-base-300 relative md:w-80 w-full  p-4 border-b flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FaUsers className="size-6 text-white" />
          <span className="text-white font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Search Bar */}
        <div className="relative block md:w-72 w-full  ">
          <input
            type="text"
            className="md:w-72 w-full p-2 pl-10 bg-[#2a2a2a] text-white rounded-lg 
            border-b border-green-600 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IoSearch className="absolute  left-3 top-3 text-gray-400" size={18} />
        </div>

        {/* Dropdown for search results */}
        {search.trim() !== "" && filteredUsers.length > 0 && (
          <div className="absolute md:w-72 w-full z-50 top-24 left-4 right-4 bg-[#2a2a2a] shadow-md rounded-lg max-h-60 overflow-y-auto border border-gray-600" 
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-3 cursor-pointer hover:bg-gray-700 flex items-center gap-3"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  setSearch(""); // Clear search after selection
                    // navigate(`/chat/${user._id}`); // Updates the URL dynamically
                  
                  
                }}
              >
                {/* Profile Image or First Letter */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white font-bold text-lg">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Name and Email */}
                <div className="flex flex-col ">
                  <h4 className="text-white text-sm font-medium">{user.name}</h4>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Users List */}
      <div className="overflow-y-auto w-full py-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {users.map((user) => {
          const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";
          const isOnline = onlineUsers?.includes(user._id) ?? false;
          const isSelected = selectedUser?._id === user._id;

          return (
            <div
              key={user._id}
              onClick={()=>handleUserClick(user)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors 
                hover:bg-gray-700 
                ${isSelected ? "bg-gray-800 ring-1 ring-gray-500" : ""}`}
            >
              {/* Profile Image or First Letter */}
              <div className="relative flex items-center justify-center w-12 h-12 min-w-[3rem] rounded-full bg-gray-700 text-white font-bold text-lg">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  firstLetter
                )}
                {/* Online Indicator */}
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-gray-900"></span>
                )}
              </div>

              {/* User Details */}
              <div className="flex flex-col">
                <h4 className="text-white text-sm font-medium">{user.name}</h4>
                <p className="text-gray-400 text-xs">{user.email}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
