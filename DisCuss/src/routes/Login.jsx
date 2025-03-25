import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../helper/showToast";
import { useDispatch } from "react-redux";
import { setuser } from "./../redux/user/user.slice.js";
import Googlelogin from "../components/Googlelogin.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formschema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(3, "Password must be at least 3 characters long"),
  });

  const onSubmit = async (formdata) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formdata),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        showToast("error", errorData.message || "Login failed");
        return;
      }

      const data = await response.json();
      dispatch(setuser(data.user));
      sessionStorage.setItem("token", data.token);

      navigate("/");
      showToast("success", data.message);
    } catch (error) {
      console.error("Login Error:", error);
      showToast("error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formschema) });

  return (
    <div className="h-screen mt-12 flex justify-center items-center">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-white">
        {/* Logo or Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <Googlelogin />

        {/* Divider with "Or" */}
        <div className="flex items-center  my-5">
          <div className="w-full border-t border-gray-300"></div>
          <span className="absolute left-1/2 -translate-x-1/2 bg-white px-2 text-gray-500 text-md font-bold">
            Or
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full p-3 bg-black/20 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full p-3 bg-black/20 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 rounded-lg shadow-lg text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-violet-600"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Additional Links */}
        <div className="text-center mt-6 text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-violet-400 hover:underline hover:text-violet-300"
            >
              Sign Up
            </Link>
          </p>
          <p className="mt-2">
            <Link
              to="/forgot-password"
              className="text-violet-400 hover:underline hover:text-violet-300"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
