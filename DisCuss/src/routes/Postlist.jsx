import React, { useState, useEffect } from "react";
import Postlistitem from "../components/Postlistitem";
import { Particles } from "../components/Magicui/Particles";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";

const Postlist = ({ category }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const url = category
          ? `${baseUrl}/blog/get-blog-by-category/${category}?page=${page}&limit=10`
          : `${baseUrl}/blog/get-all?page=${page}&limit=10`;

        const response = await fetch(url, { method: "GET", credentials: "include" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load blogs");
        }

        setBlogs(data.blogs || []);
        setTotalPages(data.pagination.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category, page]);

  return (
    <div className="container mx-auto py-8 relative">
      <Particles className="absolute top-0 left-0 w-full h-full z-0" quantity={100} ease={80} refresh />

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="mb-4 break-inside-avoid">
                <Postlistitem post={blog} />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} setPage={setPage}/>
        </>
      )}
    </div>
  );
};

export default Postlist;
