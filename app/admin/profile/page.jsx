"use client";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa"; // Person icon
import MainLayout from "../components/MainLayout";
import { jwtDecode } from "jwt-decode";
import useAuth from "@/hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProfilePage = () => {
  const { isLoading } = useAuth();
  // const [users, setUsers] = useState(usersData);
  const [user, setUser] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [fullname, setFullname] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [data, setData] = useState([]);
  const [adminFormData, setAdminFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    role: "",
    password: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
  });

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
  const removeUser = async (userId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not authorized. Please log in again.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/register/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Safely attempt to parse JSON only if there is content
      let result = {};
      const text = await response.text();
      if (text) {
        result = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      toast.success("User removed successfully");

      // Update the local state to remove the deleted user
      setData((prevData) => prevData.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/register", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const jsonData = await response.json();
        const updatedData = jsonData.data.map((item) => ({
          ...item,
        }));
        setData(updatedData);
      } catch (error) {
        console.error("Fetch Error", error);
        toast.error("Failed to fetch users");
      }
    };
    fetchData();
  }, []);

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

  const addUser = () => {
    if (!fullname || !email || !password || !role) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password, role, fullname };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        setError(data.message);
        setSuccessMessage(null);
      } else {
        // Handle success response
        setSuccessMessage(data.message);
        setError(null);
      }
      addUser();
    } catch (error) {
      console.error("Error occurred:", error);
      setError("An unexpected error occurred. Please try again later.");
      setSuccessMessage(null);
    }
  };
  // Define the updateUser function
  const updateUser = async (userId, newRole) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not authorized. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`/api/register/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }), // Sending the new role
      });

      const data = await response.json();

      // Check the status code of the response explicitly
      if (response.ok) {
        // Only show success if the response is OK
        toast.success(`User role updated to ${newRole} successfully`);

        // If the response contains a single updated user, update the state
        if (data.user) {
          // Update the user in the data state
          const updatedUsers = data.user
            ? data.user._id === userId
              ? { ...data.user, role: newRole }
              : user // Keep the original state if the user isn't updated
            : user; // Default to the current state if no user data is received.

          // Update the state with the new role
          setData((prevData) =>
            prevData.map((user) => (user._id === userId ? updatedUsers : user))
          );
        }
      } else {
        // If response is not OK, show error message
        toast.error(
          `Failed to update user role: ${data.message || "Unknown error"}`
        );
        console.log("Error:", data.message);
      }
    } catch (error) {
      // If there is a network or other unexpected error, show error message
      toast.error(
        `An error occurred while updating the user role: ${error.message}`
      );
      console.error("Error:", error);
    }
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
      <section className="text-blue-600 px-6">
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
            onSubmit={handleSubmit}
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
                  onChange={(e) => setFullname(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)} // Update role state
                  className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)} // Hide the form
                  className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id}>
                  <td className="py-3 px-6">{user.fullname}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.role}</td>
                  <td className="py-3 px-6 text-xs">
                    {/* Dynamically render the button based on the current role */}
                    {user.role === "admin" ? (
                      <button
                        onClick={() => updateUser(user._id, "manager")}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                      >
                        Promote to Manager
                      </button>
                    ) : (
                      <button
                        onClick={() => updateUser(user._id, "admin")}
                        className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                      >
                        Promote to Admin
                      </button>
                    )}

                    <button
                      onClick={() => removeUser(user._id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <ToastContainer />
    </MainLayout>
  );
};

export default AdminProfilePage;
