import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../helper/showToast";
import slugify from "slugify";
import Dropzone from "react-dropzone";
import Editor from "../Editor";
import { useSelector } from "react-redux";
import styled from "styled-components";

export const AddBlog = () => {
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

  // Define Zod Schema
  const formSchema = z.object({
    category: z.string().min(3, "Category must be at least 3 characters long"),
    title: z.string().min(3, "Title must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    blogContent: z.string().min(10, "Content must be at least 10 characters long"),
  });

  const handleeditordata = (event, editor) => {
    const data = editor.getData();
    setValue("blogContent", data);
  };

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

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  const blogTitle = watch("title");
  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      setValue("slug", slug);
    }
  }, [blogTitle, setValue]);

  const onSubmit = async (values) => {
    try {
      if (!user || !user.user || !user.user._id) {
        return showToast("error", "User not authenticated");
      }

      if (!file) {
        return showToast("error", "File should be set");
      }

      const newvalues = { ...values, author: user.user._id };
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("data", JSON.stringify(newvalues));

      setLoading(true);
      setError(false); // Reset error state when submitting

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/add`, {
        method: "POST",
        credentials: "include",
        body: formdata,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      reset();
      setFile(null);
      setPreview(null);
      setLoading(false);
      showToast("success", data.message);
      navigate("/blog");
    } catch (error) {
      setLoading(false);
      setError(true);
      showToast("error", error.message);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setValue("category", categoryId);
    setIsDropdownOpen(false);
  };

  const selectedCategoryId = watch("category");
  const selectedCategory = categories.find((cat) => cat._id === selectedCategoryId);

  const handleFileUpload = (files) => {
    const uploadedFile = files[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
  };

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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCategories(
      categories.filter((category) => category.name.toLowerCase().includes(query))
    );
  };

  return (
    <Container>
      <div className="w-3/4 p-8 mt-20 shadow-md rounded-lg">
        <Link to="/blog" className="text-blue-500 underline font-semibold text-center mb-16">
          Back To Blog
        </Link>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Category Field */}
          <CategoryField>
            <label className="block text-sm font-medium mb-1">Category</label>
            <CategorySelector
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 border rounded-md cursor-pointer"
            >
              {selectedCategory ? selectedCategory.name : "Select a Category..."}
            </CategorySelector>

            {isDropdownOpen && (
              <DropdownMenu ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Search category..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full p-2 border-b outline-none bg-gray-600 text-white"
                />
                {loading ? (
                  <p className="p-2 text-gray-400">Loading categories...</p>
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
                  <p className="p-2 text-gray-400">No categories found</p>
                )}
              </DropdownMenu>
            )}
            {errors.category && <ErrorMessage>{errors.category.message}</ErrorMessage>}
          </CategoryField>

          {/* Title Field */}
          <InputField>
            <label className="block text-sm font-medium mt-3 mb-1">Title</label>
            <StyledInput placeholder="Enter Blog Title..." type="text" {...register("title")} />
            {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
          </InputField>

          {/* Slug Field */}
          <InputField>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <StyledInput type="text" {...register("slug")} readOnly />
            {errors.slug && <ErrorMessage>{errors.slug.message}</ErrorMessage>}
          </InputField>

          {/* Featured Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Featured Image</label>
            <Dropzone onDrop={handleFileUpload}>
              {({ getRootProps, getInputProps }) => (
                <DropzoneWrapper {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="flex justify-center items-center w-36 h-36">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover rounded" />
                    ) : (
                      <p className="text-gray-400">Click to upload image</p>
                    )}
                  </div>
                </DropzoneWrapper>
              )}
            </Dropzone>
          </div>

          {/* Blog Content */}
          <EditorWrapper>
            <label className="block text-sm text-black font-medium mb-1">Blog Content</label>
            <Editor className="text-black" props={{ initialData: "", onChange: handleeditordata }} />
          </EditorWrapper>

          <SubmitButton
            className={`w-full py-2 rounded-md transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={loading}
          >
            {loading ? "Adding Blog..." : "Add Blog"}
          </SubmitButton>
        </form>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: black;
  color: white;
`;

const CategoryField = styled.div`
  position: relative;
`;

const CategorySelector = styled.div`
  background-color: #2d2d2d;
  color: white;
  border: 1px solid #444;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #2d2d2d;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #444;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.75rem;
`;

const InputField = styled.div`
  margin-bottom: 1rem;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  width: 100%;
  border-radius: 0.375rem;
  background-color: #2d2d2d;
  border: 1px solid #444;
  color: white;
`;

const DropzoneWrapper = styled.div`
  cursor: pointer;
  border: 2px dashed #444;
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: #2d2d2d;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditorWrapper = styled.div`
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  width: 100%;
  background-color: #1d72b8;
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #155a8a;
  }
  &:disabled {
    background-color: #gray;
    cursor: not-allowed;
  }
`;

export default AddBlog;
