import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import Loading from "./Loading";

const Commentdetail = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [comments, setComments] = useState([]); // State to store comments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const user=useSelector((state)=>state.user)

  // Fetch all comments from the backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/comment/get-all-comment`
        );
        const data = await response.json();

        if (data.success) {
          let filtercomment;
          if(user.user.role==="admin") filtercomment=data.comments
          else filtercomment=data.comments.filter((comment)=>comment.author.email===user.user.email)
          setComments(filtercomment);
        } else {
          setError("Failed to load comments");
        }
      } catch (err) {
        setError("Error fetching comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);
  // console.log(comments);
  

  // Handle delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/comment/delete/${commentId}`,
        { method: "DELETE" ,credentials:"include"}
      );

      const data = await response.json();

      if (data.success) {
        setComments(comments.filter((comm) => comm._id !== commentId));
        alert("Comment deleted successfully");
      } else {
        alert("Failed to delete comment");
      }
    } catch (error) {
      alert("Error deleting comment");
    }
  };
  // console.log(user);
  

  return (
    <div className="p-6 mt-24 rounded-xl min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Comments</h2>
      </div>

      {/* Loading state */}
      {loading && <div className=" flex  items-center justify-center"><Loading/></div>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Comments Table */}
      {!loading && !error && comments.length > 0 ? (
        <div className="overflow-y-auto max-h-[550px] rounded-xl">
          <table className="min-w-full bg-black text-white shadow-md border rounded-lg">
            <thead className="bg-gray-200 text-black sticky -top-0.5">
              <tr>
                <th className="py-2 px-4 text-left">Blog</th>
                <th className="py-2 px-4 text-left">Comment By</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Comment</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {comments.map((comment) => (
                <tr key={comment._id} className="border-t">
                  <td className="py-2 px-4">
                    {comment.blogid && comment.blogid.title
                      ? comment.blogid.title
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {typeof comment.author === "object" &&
                    comment.author.name
                      ? comment.author.name
                      : comment.author}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(comment.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-14">{comment.comment}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p>No comments found.</p>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Commentdetail;
