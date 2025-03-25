import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showToast } from "../helper/showToast";
import { FaSpinner } from "react-icons/fa";
import Deletebtn from "../components/Ui/Deletebtn";

const Commentlist = ({ blogid, newcomment, onDeleteComment }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the currently logged-in user from Redux
  const currentUser = useSelector((state) => state.user.user);

  // Fetch initial comments when blogid changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/comment/get/${blogid}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.success && Array.isArray(data.comment)) {
          setComments(data.comment);
          setError(null);
        } else {
          setComments([]);
          setError(data.message || "Failed to load comments");
        }
      } catch (error) {
        setError("Error while fetching comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogid]);

  // Append the new comment if it exists
  useEffect(() => {
    if (newcomment) {
      setComments((prevComments) => [newcomment, ...prevComments]);
    }
  }, [newcomment]);

  // Delete handler for a comment
  const handleDelete = async (commentid) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/comment/delete/${commentid}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.message || "Failed to delete comment");
        return;
      }
      // Remove the deleted comment from state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentid)
      );
      showToast("success", "Comment deleted successfully");
      onDeleteComment(); // Call the function to update the comment count
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("error", "Something went wrong while deleting comment");
    }
  };

  // If loading, show a spinner instead of just "Loading"
  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500">
        <FaSpinner className="animate-spin text-2xl" /> Loading...
      </div>
    );
  }

  // If error occurs, show the error message with an option to retry
  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        <p>{error}</p>
        <button
          onClick={() => setLoading(true)} // Retry logic
          className="mt-3 text-violet-500 hover:text-violet-600 font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-2xl font-bold text-gray-300">
        {comments.length} Comment{comments.length !== 1 ? "s" : ""}
      </h4>

      <div className="mt-5 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-800 rounded-lg flex gap-3 border-b pb-3"
            >
              <img
                src={comment.author?.avatar || "/default-avatar.png"}
                alt={comment.author?.name || "User"}
                className="w-12 h-12 ml-3 mt-3 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-white ml-3 mt-3">
                  {comment.author?.name || "Anonymous"}
                </p>
                <p className="text-xs ml-3 text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
                <p className="ml-3 pt-2 text-gray-300">{comment.comment}</p>
              </div>
              {currentUser &&
                (currentUser._id === comment.author?._id ||
                  currentUser.role === "admin") && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className=" text-white font-semibold  px-5 rounded-lg transition mt-3 mr-4"
                  >
                    <Deletebtn />
                  </button>
                )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default Commentlist;