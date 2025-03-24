"use client";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa"; // Person icon
import MainLayout from "../components/MainLayout";
import { jwtDecode } from "jwt-decode";
import useAuth from "@/hooks/useAuth";

function Page() {
  const { isLoading } = useAuth();
  const adminData = {
    id: "admin123",
    fullName: "Admin User",
    email: "adminuser@example.com",
    role: "Admin",
    password: "********", // Masked password
  };

  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    id: adminData.id || "",
    fullName: adminData.fullName || "",
    email: adminData.email || "",
    role: adminData.role || "",
    password: adminData.password || "",
  });
  const [user, setUser] = useState(null);

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData({
      ...adminFormData,
      [name]: value !== undefined ? value : "",
    });
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    console.log("Updated admin data:", adminFormData);
    setIsAdminEditing(false);
  };

  const cancelAdminEditing = () => {
    setAdminFormData({
      id: adminData.id || "",
      fullName: adminData.fullName || "",
      email: adminData.email || "",
      role: adminData.role || "",
      password: adminData.password || "",
    });
    setIsAdminEditing(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        fetchUserDetails(decodedUser.userId, token);
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    } else {
      console.log("No token found.");
    }
  }, []);

  const fetchUserDetails = async (userId, token) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user details.");

      const { user } = await res.json();
      localStorage.setItem("userId", user._id); // Store _id
      setUser(user);
    } catch (error) {
      console.error("Fetch user details error:", error);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 text-[#003366]">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Profile</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-blue-500 text-white rounded-full">
              <FaUserAlt size={32} />
            </div>
            <h2 className="text-2xl font-semibold">Admin Details</h2>
          </div>

          {isAdminEditing
            ? user && (
                <form onSubmit={handleAdminSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Admin ID
                      </label>
                      <input
                        type="text"
                        name="id"
                        value={adminFormData.id}
                        onChange={handleAdminChange}
                        className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={adminFormData.fullName}
                        onChange={handleAdminChange}
                        className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={adminFormData.email}
                        onChange={handleAdminChange}
                        className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={adminFormData.role}
                        onChange={handleAdminChange}
                        className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={adminFormData.password}
                        onChange={handleAdminChange}
                        className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={cancelAdminEditing}
                      className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )
            : user && (
                <div className="space-y-4">
                  <p>
                    <strong>ID:</strong> {user._id}
                  </p>
                  <p>
                    <strong>Full Name:</strong> {user.fullname}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>

                  <div className="mt-4">
                    <button
                      onClick={() => setIsAdminEditing(true)}
                      className="w-full flex items-center justify-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      <FaUserAlt className="mr-2" />
                      Edit Admin Details
                    </button>
                  </div>
                </div>
              )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Page;
