import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../helper/showToast";
import Googlelogin from "../components/Googlelogin";

const Register = () => {
  const navigate = useNavigate();

  // Define Zod Schema
  const formSchema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      email: z.string().email("Invalid email format"),
      password: z.string().min(3, "Password must be at least 3 characters long"),
      confirmPassword: z.string(),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Passwords must match",
        });
      }
    });

  // React Hook Form Integration
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  // Form Submission
  const onSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message);
        return;
      }
      navigate("/login");
      showToast("success", data.message);
    } catch (error) {
      showToast("error", "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen mt-24 flex justify-center items-center">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-white">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            Create Your Account
          </h1>
          <p className="text-gray-400 mt-2">Sign up to get started</p>
        </div>

        <Googlelogin />

        {/* Divider with "Or" */}
        <div className="flex items-center my-5">
          <div className="w-full border-t border-gray-300"></div>
          <span className="absolute left-1/2 -translate-x-1/2 bg-white px-2 text-gray-500 text-md font-bold">
            Or
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name")}
              className="w-full p-3 bg-black/20 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full p-3 bg-black/20 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full p-3 bg-black/20 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className="w-full p-3 bg-black/20 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 rounded-lg shadow-lg text-white font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        {/* Additional Links */}
        <div className="text-center mt-6 text-gray-400">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:underline hover:text-violet-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
