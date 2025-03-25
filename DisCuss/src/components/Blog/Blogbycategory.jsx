import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Postlistitem from "../Postlistitem";
import Loading from "../Loading";
import { BiCategory } from "react-icons/bi";


const Blogbycategory = () => {
  const { category } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Fetch related posts using the blog's category slug
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/blog/get-blog-by-category/${category}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          setRelatedPosts(data.blog); // API returns related posts in data.blog
          setLoading(false);
        } else {
          setRelatedPosts([]);
        }
      } catch (error) {
        console.error("Error fetching related posts:", error);
        setRelatedPosts([]);
      }
    };

    fetchRelatedPosts();
  }, [category]);

  // console.log(relatedPosts);
  
  return (
    <div className="container mt-24 mx-auto px-4 py-8">
        <h4 className="text-4xl font-bold shadow-xl p-7 rounded-2xl flex flex-row gap-2 ml-7 mb-5 text-violet-400">
            <BiCategory/>
            {relatedPosts.length>0  &&  relatedPosts[0].category.name}
            {relatedPosts.length==0  &&  "No Blog Found"}
        </h4>
      {loading && <Loading />}
      {!loading && error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}
      {!loading && !error && relatedPosts.length === 0 && (
        <p className="text-gray-500 text-center">No posts found.</p>
      )}

<div className="container mx-auto px-4 py-8">
      {/* 
        columns-1  -> 1 column on very small screens
        sm:columns-2 -> 2 columns at ≥640px
        md:columns-3 -> 3 columns at ≥768px
        lg:columns-4 -> 4 columns at ≥1024px
        gap-4      -> space between columns
      */}
      <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 gap-4">
        {relatedPosts.map((blog) => (
          <div key={blog._id} className="mb-4 break-inside-avoid">
            <Postlistitem post={blog} />
          </div>
        ))}
      </div>
    </div>
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

export default Blogbycategory;
