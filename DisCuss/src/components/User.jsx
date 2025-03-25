import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Loading from "./Loading";


const User = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [users, setusers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch all users from the backend
  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/get-all`
        );
        const data = await response.json();

        if (data.success) {
          setusers(data.user);
        } else {
          setError("Failed to load users");
        }
      } catch (err) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchusers();
  }, []);
//    console.log(users);
  

  // Handle delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/delete/${userId}`,
        { method: "DELETE" }
      );
      const data = await response.json(); // Parse the response
  
      if (data.success) {
        setusers(users.filter((user) => user._id !== userId));
        alert("User deleted successfully");
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      alert("Error deleting user");
    }
  };
  
  return (
    <div className="p-6  rounded-xl min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Users</h2>
      </div>

      {/* Loading state */}
      {loading && <div className="flex min-h-screen items-center justify-center"><Loading/></div>}
      {error && <p className="text-red-500">{error}</p>}

      {/* users Table */}
      {!loading && !error && users.length > 0 ? (
        <div className="overflow-y-auto max-h-[550px] rounded-xl">
          <table className="min-w-full bg-black text-white shadow-md border rounded-lg">
            <thead className="bg-gray-500 sticky -top-0.5">
              <tr>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Avatar</th>
                <th className="py-2 px-4 text-left">Dated</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="py-2 px-4">
                    {user.role 
                      ? user.role
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {
                    user.name
                      ? user.name
                      : "NA"}
                  </td>
                  <td className="py-2 px-4">
                    {
                    user.email
                      ? user.email
                      : "NA"}
                  </td>
                  <td className="py-2 px-2">{<img src={user.avatar || "https://res.cloudinary.com/dbtddboin/image/upload/v1739359635/DisCuss/utxysu214oyln4vsgxgx.avif"} className="w-12 h-12 rounded-3xl" alt="NA"/>}</td>
                  <td className="py-2 px-4">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p>No users found.</p>
      )}

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

export default User;
