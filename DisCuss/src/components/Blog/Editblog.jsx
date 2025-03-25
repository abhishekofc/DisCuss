import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../helper/showToast";
import slugify from "slugify";
import Dropzone from "react-dropzone";
import Editor from "../Editor";
import { useSelector } from "react-redux";

export const Editblog = () => {
  const user = useSelector((state) => state.user);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  // Use blogid since that's what the backend expects
  const { blogid } = useParams();

  // Define Zod Schema
  const formSchema = z.object({
    category: z.string().min(3, "Category must be at least 3 characters long"),
    title: z.string().min(3, "Title must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    blogContent: z.string().min(10, "Content must be at least 10 characters long"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  const handleeditordata = (event, editor) => {
    const data = editor.getData();
    setValue("blogContent", data);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/all-category`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
          setFilteredCategories(data.categories);
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

  // Auto-generate slug from title
  const blogTitle = watch("title");
  useEffect(() => {
    if (blogTitle) {
      const generatedSlug = slugify(blogTitle, { lower: true });
      setValue("slug", generatedSlug);
    }
  }, [blogTitle, setValue]);

  // Fetch blog details to pre-populate the form
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/edit/${blogid}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setValue("title", data.editblog.title);
          setValue("slug", data.editblog.slug);
          setValue("blogContent", data.editblog.blogContent);
          setValue("category", data.editblog.category);
          setPreview(data.editblog.featuredimage);
        } else {
          showToast("error", "Failed to fetch blog details");
        }
      } catch (error) {
        showToast("error", error.message);
      }
    };

    if (blogid) {
      fetchBlogDetails();
    }
  }, [blogid, setValue]);

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      if (!user || !user.user || !user.user._id) {
        return showToast("error", "User not authenticated");
      }

      // Prepare form data
      const formdata = new FormData();
      if (file) {
        formdata.append("file", file);
      }
      formdata.append("data", JSON.stringify(values));

      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/update/${blogid}`, {
        method: "PUT",
        credentials: "include",
        body: formdata,
      });

      const data = await response.json();

      if (!response.ok) {
        return showToast("error", data.message);
      }

      reset();
      setLoading(false);
      setFile(null);
      setPreview(null);
      navigate("/blog");
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setValue("category", categoryId);
    setIsDropdownOpen(false);
  };

  const selectedCategoryId = watch("category");
  const selectedCategory = categories.find(
    (cat) => String(cat._id) === String(selectedCategoryId)
  );

  // Handle image upload
  const handleFileUpload = (files) => {
    const uploadedFile = files[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter categories based on search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="flex flex-col items-center mt-24 justify-center min-h-screen bg-black text-white">
      <div className="w-3/4 p-8 bg-gray-800 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Blog</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Category Field */}
          <div className="mb-4 relative" ref={dropdownRef}>
            <label className="block text-sm font-medium mb-1">Category</label>
            <div
              className="p-2 border rounded-md cursor-pointer bg-gray-700 text-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedCategory ? selectedCategory.name : "Select a Category..."}
            </div>

            {isDropdownOpen && (
              <div className="absolute left-0 w-full bg-gray-700 border rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
                <input
                  type="text"
                  placeholder="Search category..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full p-2 border-b outline-none bg-gray-600 text-white"
                />

                {loading ? (
                  <p className="p-2 text-gray-500">Loading categories...</p>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category, key) => (
                    <div
                      key={key}
                      className="p-2 hover:bg-gray-600 cursor-pointer"
                      onClick={() => handleCategorySelect(category._id)}
                    >
                      {category.name}
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-gray-500">No categories found</p>
                )}
              </div>
            )}
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category.message}</p>
            )}
          </div>

          {/* Title Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              placeholder="Enter Blog Title..."
              type="text"
              {...register("title")}
              className="p-2 w-full border rounded-md bg-gray-700 text-white"
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* Slug Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              {...register("slug")}
              readOnly
              className="p-2 w-full border rounded-md bg-gray-600 text-white"
            />
            {errors.slug && (
              <p className="text-red-500 text-xs">{errors.slug.message}</p>
            )}
          </div>

          {/* Featured Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Featured Image</label>
            <Dropzone onDrop={handleFileUpload}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="cursor-pointer border-2 border-dashed rounded p-4 text-center flex items-center justify-center bg-gray-700"
                >
                  <input {...getInputProps()} />
                  <div className="flex justify-center items-center w-36 h-36">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <p className="text-gray-500">Click to upload image</p>
                    )}
                  </div>
                </div>
              )}
            </Dropzone>
          </div>

          {/* Blog Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Blog Content</label>
            <Editor props={{ initialData: watch("blogContent"), onChange: handleeditordata }} />
          </div>

          {/* Submit Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            {!loading ? "Edit Blog" : "Editing Blog..."}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Editblog;
