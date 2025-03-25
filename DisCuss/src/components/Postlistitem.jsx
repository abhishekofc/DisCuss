import React from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import Commentcount from './Commentcount.jsx';
import Likecount from './Likecount.jsx';
import { useNavigate } from "react-router-dom";
import { FaShare } from "react-icons/fa";

const Postlistitem = ({ post }) => {
  const navigate=useNavigate();
  // Function to handle sharing
  const handleShare = async () => {
    const postUrl = `${window.location.origin}/blog/${post.category.name}/${post.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: "Check out this blog post!",
          url: postUrl,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(postUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#212121' }} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-md sm:max-w-full">
      {/* User Info Section */}
      <div className="flex items-center px-4 py-3">
        <img
          src={post.author.avatar || "default.png"}
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <p className="text-sm font-semibold text-gray-100">{post.author.name}</p>
          <p className="text-xs text-gray-500">{new Date(post.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredimage && (
        <Link to={`/blog/${post.category.name}/${post.slug}`}>
          <img
            src={post.featuredimage}
            alt={post.title}
            className="w-full h-auto rounded-xl p-2 object-cover"
          />
        </Link>
      )}

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center justify-between space-x-2">
          <h2 className="text-lg font-semibold text-gray-100">{post.title}</h2>
          {post.category && (
            <span className="text-xs font-medium text-white bg-blue-700 px-2 py-1 rounded">
              {post.category.name}
            </span>
          )}
        </div>
        <p
          className="text-sm text-gray-400 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.blogContent),
          }}
        ></p>
      </div>

      {/* Action Buttons (Like, Comment, Share) */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-700">
        <div className="flex space-x-4 text-yellow-300">
          <Likecount blogid={post._id} />
          <Link to={`/blog/${post.category.name}/${post.slug}`} className="flex items-center  pt-0.5">
          <Commentcount blogid={post._id} />

          </Link>
          <button
            className="flex items-center text-blue-400 space-x-1 hover:text-green-600"
            onClick={handleShare}
          >
            <FaShare className="w-5 h-5" />
          </button>
        </div>

        {/* Read More Button */}
        <Link
          to={`/blog/${post.category.name}/${post.slug}`}
          className="text-blue-500 text-sm font-semibold hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default Postlistitem;
