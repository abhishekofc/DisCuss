// Maincategory.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { RiArrowDownDoubleLine } from "react-icons/ri";

const Maincategory = ({ onCategorySelect, selectedCategory }) => {
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [COLLAPSED_LIMIT,setCOLLAPSED_LIMIT] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const updateLimit = () => {
      setCOLLAPSED_LIMIT(window.innerWidth < 468 ? 3 : 5);
    };

    updateLimit(); // Set initial value
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/category/all-category`
        );
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories || []);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const visibleCategories = expanded ? categories : categories.slice(0, COLLAPSED_LIMIT);
  const handleToggle = () => setExpanded((prev) => !prev);

  // Search-related functions
  const getInput = (e) => setSearchQuery(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/blog/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBtnClick = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/blog/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div
      style={{ backgroundColor: "#212121" }}
      className={`flex flex-col md:flex-row ${
        expanded ? "md:rounded-lg lg:rounded-3xl" : "md:rounded-2xl lg:rounded-full"
      } bg-gray-800 p-4 shadow-lg rounded-xl items-center justify-center gap-1 md:gap-6`}
    >
      {/* Category Buttons */}
      <div className="flex-1 flex items-center flex-wrap gap-3">
        <button
          onClick={() => onCategorySelect(null)}
          className={`bg-blue-700 text-white rounded-full px-4 py-2 transition-all hover:bg-blue-600 ${
            selectedCategory === null ? "ring-2 ring-blue-400" : "bg-transparent"
          }`}
        >
          All Posts
        </button>

        {loading && <p className="text-gray-500">Loading categories...</p>}
        {!loading && error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading &&
          !error &&
          visibleCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onCategorySelect(cat.slug)}
              className={`hover:bg-blue-600 text-white rounded-full px-4 py-2 flex items-center gap-2 transition-all ${
                selectedCategory === cat.slug ? "ring-2 ring-blue-400 bg-blue-700" : ""
              }`}
            >
              {cat.name}
            </button>
          ))}

        {!loading && !error && categories.length > COLLAPSED_LIMIT && (
          <button
            onClick={handleToggle}
            className="hover:bg-blue-600 text-white rounded-full px-2 py-2 font-medium transition-all"
          >
            {expanded ? <MdKeyboardDoubleArrowUp /> : <RiArrowDownDoubleLine />}
          </button>
        )}
      </div>

      {/* Search Bar */}
      <span className="text-xl font-medium md:block hidden text-gray-500">|</span>
      <div className="bg-gray-700 p-2 rounded-full flex items-center gap-2">
        <FaSearch
          className="cursor-pointer text-white hover:text-blue-400"
          onClick={handleBtnClick}
        />
        <input
          type="text"
          placeholder="Search a post..."
          className="bg-transparent focus:outline-none text-white placeholder-gray-400"
          onInput={getInput}
          onKeyPress={handleKeyPress}
          value={searchQuery}
        />
      </div>
    </div>
  );
};

export default Maincategory;
