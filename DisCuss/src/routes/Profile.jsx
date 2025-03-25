import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoCamera } from "react-icons/io5";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { setuser } from "../redux/user/user.slice.js";
import { useFetch } from "../hooks/usefetch.js";
import { showToast } from "../helper/showToast";
import Loading from "../components/Loading.jsx";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: userdata, loading } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/user/get-user/${user?.user?._id}`,
    { method: "get", credentials: "include" }
  );

  const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    bio: z.string().min(3, "Bio must be at least 3 characters long"),
    email: z.string().email("Invalid email"),
    password: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", bio: "", password: "" },
  });

  useEffect(() => {
    if (userdata?.success) {
      reset({
        name: userdata.user.name,
        email: userdata.user.email,
        bio: userdata.user.bio,
      });
      setPreview(userdata.user.avatar);
    }
  }, [userdata, reset]);

  const handleFileUpload = (files) => {
    const uploadedFile = files[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
  };

  const onSubmit = async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/update-user/${userdata?.user._id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.message);
        setIsSubmitting(false);
        return;
      }

      dispatch(setuser(data.user));
      showToast("success", "Profile updated successfully!");
      setFile(null);
      setPreview(data.user.avatar);
    } catch (error) {
      console.error(error); // Log error for debugging
      showToast("error", "Something went wrong!");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center mt-20 min-h-screen py-5 ">
      {isSubmitting && <Loading />}
      <div style={{backgroundColor:"#212121"}} className="flex flex-col items-center  lg:w-2/4 md:w-3/4 w-5/6 border-2 rounded-md shadow-lg max-h-fit">
        <Dropzone onDrop={handleFileUpload}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <div className="relative group flex items-center justify-center">
                <img
                  src={
                    preview ||
                    "https://res.cloudinary.com/dbtddboin/image/upload/v1739359635/DisCuss/utxysu214oyln4vsgxgx.avif"
                  }
                  alt="Profile"
                  className="rounded-full w-32 h-32 mt-7 mb-7 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 w-32 h-32 mt-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IoCamera color="#7c3aed" size={24} />
                </div>
              </div>
            </div>
          )}
        </Dropzone>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full px-6 py-4">
          {["name", "email", "bio", "password"].map((field) => (
            <div key={field} className="mb-6">
              <label className="block text-sm font-bold capitalize text-gray-300">
                {field}
              </label>
              <input style={{backgroundColor:"#212121"}}
                type={field === "password" ? "password" : "text"}
                {...register(field)}
                className="mt-1 p-3 w-full  text-white border rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                placeholder={`Enter your ${field}...`}
              />
              {errors[field] && (
                <p className="text-red-500 text-xs mt-1">{errors[field]?.message}</p>
              )}
            </div>
          ))}
          <div className="text-right w-full">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white py-2 px-4 rounded-md transition ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
