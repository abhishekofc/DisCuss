import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Deletebtn from "../Ui/Deletebtn";

const Categorydetail = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [categories, setCategories] = useState([]); // State to store categories
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/all-category`);
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.categories);
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

  // Handle delete category
  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/delete/${categoryId}`, {
        method: "DELETE",
        credentials:"include"
      });

      const data = await response.json();

      if (data.success) {
        setCategories(categories.filter((cat) => cat._id !== categoryId));
        alert("Category deleted successfully");
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      alert("Error deleting category");
    }
  };

  return (
    <div className="  min-h-screen rounded-xl mt-20 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Category List</h2>
        <button
          onClick={() => navigate("/add-category")}
          className="bg-blue-500 text-white py-2 px-4 rounded-md transition hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>

      {/* Show loading state */}
      {loading && <p>Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Category Table */}
      {!loading && !error && categories.length > 0 ? (
        <div style={{backgroundColor:"#212121"}} className="overflow-y-auto max-h-[550px] border rounded-lg">
        <table className="min-w-full bg-black text-white shadow-md border">
          <thead className="bg-gray-900 sticky z-30 -top-0.5">
            <tr>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Slug</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((category) => (
              <tr key={category._id} className="border-t">
                <td className="py-2 px-10">{category.name}</td>
                <td className="py-2 px-4">{category.slug}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(category._id)}
                    className=" text-white px-3 py-1   transition"
                  >
                    <Deletebtn />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      ) : (
        !loading && <p>No categories found.</p>
      )}
    </div>
  );
};

export default Categorydetail;
