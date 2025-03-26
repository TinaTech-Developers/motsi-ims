"use client";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa"; // Person icon
import MainLayout from "../components/MainLayout";
import { jwtDecode } from "jwt-decode";
import useAuth from "@/hooks/useAuth";

const usersData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Agent" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User" },
];

const AdminProfilePage = () => {
  const { isLoading } = useAuth();
  const [users, setUsers] = useState(usersData);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
  });
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    role: "",
    password: "",
  });
  const [user, setUser] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // New state for the add user form

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
      setAdminFormData({
        id: user._id,
        fullName: user.fullname,
        email: user.email,
        role: user.role,
        password: "********", // Masked password
      });
    } catch (error) {
      console.error("Fetch user details error:", error);
    }
  };

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
      id: user._id || "",
      fullName: user.fullname || "",
      email: user.email || "",
      role: user.role || "",
      password: user.password || "",
    });
    setIsAdminEditing(false);
  };

  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("All fields are required.");
      return;
    }
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setNewUser({ name: "", email: "", role: "User", password: "" });
    setShowAddUserForm(false); // Hide the form after submission
  };

  const changeUserRole = (id, role) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, role } : user
    );
    setUsers(updatedUsers);
  };

  const removeUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <MainLayout>
      <div className="container mx-auto p-6 text-[#003366]">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Profile</h1>
        <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-blue-500 text-white rounded-full">
              <FaUserAlt size={32} />
            </div>
            <h2 className="text-2xl font-semibold">Admin Details</h2>
          </div>

          {isAdminEditing
            ? user && (
                <form onSubmit={handleAdminSubmit}>
                  <div className="grid grid-cols-1 gap-4 ">
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

      {/* User Management Section */}
      <section className="text-blue-600">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Manage Users
        </h2>

        <button
          onClick={() => setShowAddUserForm(true)} // Show the add user form
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
        >
          Add New User
        </button>

        {showAddUserForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addUser();
            }}
            className="mb-4 bg-gray-100 p-4 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-4">Add New User</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleUserChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleUserChange}
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
                  value={newUser.password}
                  onChange={handleUserChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleUserChange}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="User">User</option>
                  <option value="Agent">Agent</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)} // Hide the form
                  className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => changeUserRole(user.id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="User">User</option>
                    <option value="Agent">Agent</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => removeUser(user.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </MainLayout>
  );
};

export default AdminProfilePage;
