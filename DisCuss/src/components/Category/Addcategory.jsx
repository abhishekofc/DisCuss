import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../helper/showToast";
import slugify from "slugify";
import styled from "styled-components";

export const Addcategory = () => {
  const navigate = useNavigate();

  // Define Zod Schema
  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
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
      name: "",
      slug: "",
    },
  });

  // Automatically generate slug when name is typed
  const catename = watch("name");
  useEffect(() => {
    if (catename) {
      const slug = slugify(catename, { lower: true });
      setValue("slug", slug);
    }
  }, [catename, setValue]);

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/category/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add category");
      }

      showToast("success", "Category added successfully!");
      reset(); // Reset form only on success
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <StyledWrapper>
      {/* Go Back Button */}
      <button onClick={() => navigate("/category")} className="go-back-button">
        Go Back
      </button>

      {/* Form Container */}
      <div className="form-container">
        <h2 className="title">Add Category</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="input-container">
            <label className="label">Name</label>
            <input
              placeholder="Enter category name..."
              type="text"
              {...register("name")}
              className="input"
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          {/* Slug Field */}
          <div className="input-container">
            <label className="label">Slug</label>
            <input
              placeholder="Slug will be generated automatically..."
              type="text"
              {...register("slug")}
              readOnly
              className="input slug-input"
            />
            {errors.slug && <p className="error-text">{errors.slug.message}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Add Category
          </button>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #00000; /* Default background color for the page */
  
  .go-back-button {
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
    margin-bottom: 20px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }

  .go-back-button:hover {
    background-color: #444;
  }

  .form-container {
    background-color: #1e1e1e; /* Darker background for the form */
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 20px;
    font-weight: 600;
  }

  .input-container {
    margin-bottom: 20px;
  }

  .label {
    display: block;
    margin-bottom: 8px;
    color: #58bc82; /* Accent color */
    font-weight: 600;
  }

  .input {
    width: 100%;
    padding: 12px;
    background-color: #2d2d2d;
    color: #fff;
    border: 2px solid #444;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
  }

  .input:focus {
    border-color: #58bc82; /* Accent color on focus */
  }

  .slug-input {
    background-color: #444;
    cursor: not-allowed;
  }

  .error-text {
    color: #ff6b6b;
    font-size: 0.875rem;
    margin-top: 5px;
  }

  .submit-button {
    width: 100%;
    padding: 12px;
    background-color: #58bc82; /* Accent color */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }

  .submit-button:hover {
    background-color: #4a9c6c;
  }
`;
