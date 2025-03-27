"use client";
import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";

function ClientList() {
  const { isLoading } = useAuth();

  const [clients, setClients] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/clients", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("failed to fetch policies");
        const jsonData = await response.json();
        const updatedData = jsonData.data.map((item) => ({
          ...item,
        }));
        setClients(updatedData);
      } catch (error) {
        console.error("Fetch error", error);
        alert("Failed to fetch clients");
      }
    };
    fetchData();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    vehicle: "",
  });
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setData([]);
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const newData = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      vehicle: formData.vehicle.trim(),
    };

    for (const key in newData) {
      if (!newData[key]) {
        alert(`Field "${key}" is required.`);
        return;
      }
    }

    try {
      const response = await fetch(`/api/clients/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setData([...data, result.data]); // Add new client
      setShowAddClientForm(false); // Close form on success
    } catch (error) {
      console.error("Submit Error:", error);
      alert(`Failed to submit client: ${error.message}`);
    }
  };

  if (isLoading) return null;

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingClient(null);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter((client) => client.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-6 text-[#003366]">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Client Management
            </h2>
            <button
              onClick={toggleForm}
              className={`px-4 py-2 rounded text-white ${
                showForm
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {showForm ? "- Cancel" : "+ Add Record"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Client Name"
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.name || ""}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.email || ""}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.phone || ""}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="vehicle"
                  placeholder="Vehicle"
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.policyNumber || ""}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {editingClient ? "Update Client" : "Add Client"}
              </button>
            </form>
          )}

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 ">
                {["Name", "Email", "Phone", "Vehicle", "Actions"].map(
                  (col, idx) => (
                    <th key={idx} className="px-4 py-2 text-start">
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-start">{client.fullname}</td>
                  <td className="px-4 py-2 text-start">{client.email}</td>
                  <td className="px-4 py-2 text-start">{client.phone}</td>
                  <td className="px-4 py-2 text-start">{client.vehicle}</td>
                  <td className="px-4 py-2 text-start space-x-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-blue-600 hover:underline"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:underline"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

export default ClientList;
