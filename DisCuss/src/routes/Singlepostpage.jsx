import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Comment from "./Comment.jsx";
import Commentlist from "./Commentlist.jsx";
import Commentcount from "../components/Commentcount.jsx";
import Likecount from "../components/Likecount.jsx";
import Loading from "../components/Loading.jsx";
import { Particles } from "./../components/Magicui/Particles.jsx";
import { FaShare } from "react-icons/fa";

const Singlepostpage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  const handleShare = async () => {
    const posturl = `${window.location.origin}/blog/${blog.category.name}/${blog.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: "Check out this blog post!",
          url: posturl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(posturl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/blog/get-blog/${slug}`,
          { method: "GET", credentials: "include" }
        );
        const data = await response.json();
        if (data.success) {
          setBlog(data.blog);
          setCommentCount(data.blog.commentCount || 0); // Assuming the API returns comment count
          setError(null);
        } else {
          setError(data.message || "Failed to load blog");
        }
      } catch (error) {
        setError("Error while fetching blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (blog?._id && blog.category && blog.category.slug) {
      const fetchRelatedPosts = async () => {
        try {
          const categorySlug = blog.category.slug;
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/blog/get-related-blog/${categorySlug}`,
            { method: "GET", credentials: "include" }
          );
          const data = await response.json();
          if (data.success) {
            setRelatedPosts(data.blog);
          } else {
            setRelatedPosts([]);
          }
        } catch (error) {
          console.error("Error fetching related posts:", error);
          setRelatedPosts([]);
        }
      };

      fetchRelatedPosts();
    }
  }, [blog]);

  const handleCommentDelete = () => {
    setCommentCount((prevCount) => prevCount - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!blog) return <p className="text-center mt-10">No blog found.</p>;

  return (
    <div className="container mx-auto py-8 mt-20 min-h-screen bg-black text-white">
      <Particles
        className="absolute top-0 left-0 w-full h-full z-0"
        quantity={100}
        ease={80}
        refresh
      />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Main Content */}
        <div className="lg:w-2/3">
          {/* Post Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Left Side: Title & Details */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {blog.title}
                </h1>
                <div className="mt-2 text-sm text-gray-400">
                  <span>
                    Published on {new Date(blog.createdAt).toDateString()}
                  </span>
                  <span className="mx-2">&bull;</span>
                  <span>Category: {blog.category.name}</span>
                  <span className="mx-2">&bull;</span>
                  <span>By {blog.author?.name}</span>
                </div>
              </div>
              {/* Right Side: Like and Comment Counters */}
              <div className="mt-4 md:mt-0 flex gap-4">
                <Likecount blogid={blog._id} />
                <Commentcount blogid={blog._id} increase={newComment} decrease={commentCount} />
                <button
                  className="flex items-center text-blue-400 space-x-1 hover:text-green-600"
                  onClick={handleShare}
                >
                  <FaShare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={blog.author?.avatar || "https://via.placeholder.com/150"}
              alt="Author"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">
                {blog.author?.name || "Unknown Author"}
              </h2>
              {blog.author?.bio && (
                <p className="text-sm text-gray-400">{blog.author.bio}</p>
              )}
            </div>
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Featured Image */}
            <div className="lg:w-1/2">
              <img
                src={blog.featuredimage || "https://via.placeholder.com/800x600"}
                alt="Featured"
                className="w-full max-h-[500px] object-cover rounded-xl shadow-lg"
              />
            </div>
            {/* Blog Content */}
            <div className="lg:w-1/2 text-lg leading-relaxed overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-800">
              <div
                className="prose max-w-none text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: blog.blogContent || "No content available.",
                }}
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-600 mt-8 pt-6">
            <Comment blogid={blog._id} setNewComment={setNewComment} />
            <Commentlist
              blogid={blog._id}
              newcomment={newComment}
              onDeleteComment={handleCommentDelete}
            />
          </div>
        </div>

        {/* Right Column: Related Posts Sidebar */}
        <div className="lg:w-1/3">
          <div
            style={{ backgroundColor: "#212121" }}
            className="sticky top-20 p-6 rounded-lg shadow-lg border border-gray-600"
          >
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              Related Blogs
            </h2>
            {(() => {
              const filteredPosts = relatedPosts.filter(
                (post) => post.slug !== slug
              );
              if (filteredPosts.length === 0) {
                return (
                  <p className="text-gray-400 text-sm">No related Blogs found.</p>
                );
              }
              return filteredPosts.map((post) => (
                <Link
                  to={`/blog/${post.category.slug}/${post.slug}`}
                  key={post._id}
                  className="flex items-center gap-4 mb-4 p-2 hover:bg-gray-700 rounded transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src={post.featuredimage || "https://via.placeholder.com/100"}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      By {post.author.name}
                    </p>
                  </div>
                </Link>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Singlepostpage;