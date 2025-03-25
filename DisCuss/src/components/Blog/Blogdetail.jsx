import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { MdDelete } from "react-icons/md";
import Deletebtn from "./../Ui/Deletebtn.jsx"
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import Loading from "../Loading.jsx"; // Assuming you have a spinner component
import Editbtn from "../Ui/Editbtn.jsx";

const Blogdetail = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate(); // Hook for navigation
  const [blogs, setBlogs] = useState([]); // State to store blogs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [deleting, setDeleting] = useState(false); // Deleting state

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/get-all`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          let filterdata;

          if (user.user.role !== "admin") {
            filterdata = data.blogs.filter(
              (blog) => blog.author.email.toLowerCase() === user.user.email.toLowerCase()
            );
          } else {
            filterdata = data.blogs;
          }

          setBlogs(filterdata);
        } else {
          setError("Failed to load blogs.");
        }
      } catch (err) {
        setError("Error while fetching blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [user]);

  // Delete handler (adapt as needed)
  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }
    setDeleting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/delete/${blogId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
        alert("Blog deleted successfully");
      } else {
        alert("Failed to delete blog");
      }
    } catch (error) {
      alert("Error deleting blog");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 mt-20 text-white  rounded-xl min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/add-blog")}
          className="bg-blue-600 text-white py-2 px-4 rounded-md transition hover:bg-blue-700"
        >
          Add Blog
        </button>
      </div>

      {loading ? (
        <div className="fle min-h-screen justify-center items-center">
          <Loading /> {/* A custom loading spinner component */}
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          {blogs.length > 0 ? (
            <div className="overflow-x-auto max-h-[550px] border rounded-lg border-gray-700">
              <table style={{backgroundColor:"#212121"}} className="min-w-full  shadow-md border">
                <thead className=" bg-black z-30 sticky -top-0.5">
                  <tr>
                    <th className="py-2 px-4 text-left text-gray-300">Author</th>
                    <th className="py-2 px-4 text-left text-gray-300">Category</th>
                    <th className="py-2 px-4 text-left text-gray-300">Title</th>
                    <th className="py-2 px-4 text-left text-gray-300">Slug</th>
                    <th className="py-2 px-4 text-left text-gray-300">Date</th>
                    <th className="py-2 px-4 text-left text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="border-t border-gray-700 hover:bg-gray-700 transition duration-200">
                      <td className="py-2 px-4">{blog.author?.name || "Unknown"}</td>
                      <td className="py-2 px-4">{blog.category?.name || "N/A"}</td>
                      <td className="py-2 px-4">{blog.title}</td>
                      <td className="py-2 px-4">{blog.slug}</td>
                      <td className="py-2 px-4">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleString() : ""}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/edit-blog/${blog._id}`)}
                            className="text-white px-3 py-1 mb-3 rounded-full  transition"
                          >
                            <Editbtn />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            disabled={deleting}
                            className={`h-8 text-white px-3 mt-1 rounded-md ${
                              deleting ? " cursor-not-allowed" : ""
                            } transition`}
                          >
                            <Deletebtn/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No blogs found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Blogdetail;
