"use client";
import useAuth from "@/hooks/useAuth";
import MainLayout from "../components/MainLayout";
import { useState } from "react";

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
      <div className="min-h-screen bg-gray-100 py-8 px-6 text-[#003366]">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Admin Profile Management
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Admin Details
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                className="p-2 border rounded"
                placeholder="Admin Name"
              />
              <input
                type="email"
                className="p-2 border rounded"
                placeholder="Admin Email"
              />
              <input
                type="password"
                className="p-2 border rounded"
                placeholder="Change Password"
              />
              <button className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded">
                Update Details
              </button>
            </form>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Register New User
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleUserChange}
                className="p-2 border rounded"
                placeholder="User Name"
              />
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleUserChange}
                className="p-2 border rounded"
                placeholder="User Email"
              />
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleUserChange}
                className="p-2 border rounded"
                placeholder="Password"
              />
              <select
                name="role"
                value={newUser.role}
                onChange={handleUserChange}
                className="p-2 border rounded"
              >
                <option value="User">User</option>
                <option value="Agent">Agent</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                type="button"
                onClick={addUser}
                className="col-span-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Register User
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Manage Users
            </h2>
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
                        onChange={(e) =>
                          changeUserRole(user.id, e.target.value)
                        }
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
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminProfilePage;
