import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeuser } from "../redux/user/user.slice";
import { IoMdAdd } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { showToast } from "../helper/showToast";
import { TbCategory } from "react-icons/tb";
import { IoIosPeople } from "react-icons/io";
import Loginbtn from "./Ui/Loginbtn";
import { FaComments } from "react-icons/fa6";
import { TbMessageDots } from "react-icons/tb";

import Logobtn from "./Ui/Logobtn";

const Navbar = () => {
  const { user, isLoggedin } = useSelector((state) => state.user);

  return (
    <nav   className="w-full rounded-3xl border-b-2 z-50 backdrop-blur-lg fixed top-0 left-0 right-0   text-white">
      <div className="flex items-center  justify-between lg:px-14 px-5  h-16 md:h-20">
        <Link to="/">
          <Logobtn/>
          {/* logo */}
        </Link>
        {/* Mobile Version */}
        <div className="md:hidden">
          {!isLoggedin ? (
            <Link to="/login">
              <button className="py-2 px-4 rounded-full  text-violet-800 font-semibold shadow  transition">
                <Loginbtn />
                {/* hi */}
              </button>
            </Link>
          ) : (
             <UserDropdown />
            // <button>i</button>
          )}
        </div>
        {/* Desktop Version */}
        <div className="hidden md:flex items-center  font-medium">
          {!isLoggedin ? (
            <Link to="/login">
              <Loginbtn />
              {/* hi */}
            </Link>
          ) : (
             <UserDropdown />
            // <bytton>hi</bytton>
          )}
        </div>
      </div>
    </nav>
  );
};

const UserDropdown = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.message);
        return;
      }
      dispatch(removeuser());
      sessionStorage.removeItem("token");
      setIsOpen(false);
      showToast("success", data.message);
      navigate("/login");
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <div className="relative " ref={dropdownRef}>
      <div className="flex flex-row gap-3">
      <button className="animate-pulse" onClick={()=>(navigate("/chat"))}>
      <TbMessageDots size={33}/>
      </button>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded-full transition focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img
          src={user?.avatar || "https://res.cloudinary.com/dbtddboin/image/upload/v1739359635/DisCuss/utxysu214oyln4vsgxgx.avif"}
          alt={`${user?.name || "Guest"}'s avatar`}
          className="w-12 h-12 border-2 border-white rounded-full"
        />
      </button>

      </div>
      {isOpen && (
        <div  style={{ backgroundColor: '#212121' }}  className="absolute right-0 mt-2 z-100 w-64 bg-gray-800 text-white border rounded-xl shadow-lg overflow-hidden ">
          <div className="px-4 py-2">
            <div className="text-md font-semibold">{user?.name || "Guest"}</div>
            <span className="text-sm text-gray-400 block">{user?.email || "Guest_Email"}</span>
          </div>
          <hr className="border-gray-700" />
          <Link
            to="/profile"
            className=" px-4 py-3 hover:bg-gray-600 flex items-center gap-3 text-sm"
            onClick={() => setIsOpen(false)}
          >
            <FaUser size={20} className="text-violet-400" /> Profile
          </Link>
          <Link
            to="/blog"
            className=" px-4 py-3 hover:bg-gray-600 flex items-center gap-3 text-sm"
            onClick={() => setIsOpen(false)}
          >
            <IoMdAdd size={24} className="text-violet-400" /> Create Blog
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/category"
              className=" px-4 py-3 hover:bg-gray-600 flex items-center gap-3 text-sm"
              onClick={() => setIsOpen(false)}
            >
              <TbCategory size={24} className="bg-gray-600" /> Categories
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/users"
              className=" px-4 py-3 hover:bg-gray-600 flex items-center gap-3 text-sm"
              onClick={() => setIsOpen(false)}
            >
              <IoIosPeople size={24} className="text-violet-400" /> Users
            </Link>
          )}
          <Link
            to="/comments"
            className=" px-4 py-3 hover:bg-gray-600 flex items-center gap-3 text-sm"
            onClick={() => setIsOpen(false)}
          >
            <FaComments size={24} className="text-violet-400" /> Comments
          </Link>
          <hr className="border-gray-700" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-600 flex items-center gap-3 focus:outline-none"
          >
            <LuLogOut size={24} className="text-red-500" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
