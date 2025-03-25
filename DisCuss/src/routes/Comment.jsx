import { FaComments } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "../helper/showToast";
import { Link } from "react-router-dom";
import Commentlist from "./Commentlist";

const Comment = ({ blogid, setNewComment }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // Validation schema for the comment text
  const schema = z.object({
    Comment: z.string().min(3, "Comment must be at least 3 characters long"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { Comment: "" },
  });

  // Submit handler for adding a new comment
  const onSubmit = async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const newvalues = {
        ...values,
        blogid, // Passed directly from props
        author: user.user._id,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/comment/add`,
        {
          method: "POST",
          credentials:"include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newvalues),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message || "Something went wrong!");
        setIsSubmitting(false);
        return;
      }

      // Ensure the new comment has a valid _id and author info.
      // **Include the user's _id in the author object for proper deletion checks.**
      const forcedId = data.newcomment._id || Date.now().toString();
      const userInfo = user.user;
      const fullComment = {
        ...data.newcomment,
        _id: forcedId,
        author: {
          _id: userInfo._id, // <-- Added this line
          name: userInfo.name,
          avatar: userInfo.avatar || "/default-avatar.png",
        },
        createdAt: new Date().toISOString(),
      };

      // Pass the new comment to the parent so Commentlist can update
      setNewComment(fullComment);
      reset();
      showToast("success", "Comment added successfully!");
    } catch (error) {
      showToast("error", "Something went wrong!");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="shadow-lg rounded-lg p-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
        <FaComments className="text-violet-500" />
        Comments
      </h1>

      {user && user.isLoggedin ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
  <label className="block text-lg mb-2 text-white font-semibold ">
    Your Comment
  </label>
  <textarea
    {...register("Comment")}
    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-white text-gray-800 placeholder-gray-500"
    placeholder="Write your comment here..."
    rows="4"
  />
  {errors.Comment && (
    <p className="text-red-500 text-sm mt-1">
      {errors.Comment.message}
    </p>
  )}
</div>


          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-violet-500 text-white font-semibold py-2 px-5 rounded-lg transition ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-violet-600"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <button
          className={`bg-violet-500 text-white font-semibold py-2 px-5 rounded-lg transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-violet-600"
          }`}
        >
          <Link to="/login">Sign In</Link>
        </button>
      )}
    </div>
  );
};

export default Comment;
