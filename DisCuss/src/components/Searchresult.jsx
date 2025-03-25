import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Postlistitem from "./Postlistitem";
import Maincategory from "./Maincategory";
import Loading from "./Loading.jsx";
import { Particles } from "./Magicui/Particles.jsx";

const Searchresult = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/blog/search?q=${encodeURIComponent(q)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          setRelatedPosts(data.blog);
          setLoading(false)
        } else {
          setLoading(false)
          setRelatedPosts([]);
          setError(data.message || "No posts found.");
        }
      } catch (error) {
        setLoading(false)
        console.error("Error fetching related posts:", error);
        setRelatedPosts([]);
        setError("Error fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    if (q) {
      fetchRelatedPosts();
    }
  }, [q]);

  return (
    <div>
      {/* <div className="mt-8 mb-6">
        <Maincategory />
      </div> */}

      <div className="mx-auto h-32 mt-12 w-full flex-row">

      {loading && <Loading />}
      {!loading && error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <div className="text-2xl mt-3 ml-7 mb-3">
          Search Results
        </div>


        <div className="container mx-auto  py-8">
      {/* 
        columns-1  -> 1 column on very small screens
        sm:columns-2 -> 2 columns at ≥640px
        md:columns-3 -> 3 columns at ≥768px
        lg:columns-4 -> 4 columns at ≥1024px
        gap-4      -> space between columns
      */}
       <Particles
              className="absolute top-0 left-0 w-full h-full z-0"
              quantity={100}
              ease={80}
              refresh
            />
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
            </div>
  );
};

export default Searchresult;
