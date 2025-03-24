"use client";
import { useState } from "react";
import MainLayout from "../components/MainLayout";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

function ClientList() {
  const { isLoading } = useAuth();

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Tinashe Phiri",
      email: "tinashephiri@example.com",
      phone: "123-456-7890",
      policyNumber: "POL12345",
    },
    {
      id: 2,
      name: "Tinotenda Phiri",
      email: "tinophiri@example.com",
      phone: "987-654-3210",
      policyNumber: "POL12346",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  if (isLoading) return null;

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingClient(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const clientData = {
      id: editingClient
        ? editingClient.id
        : clients.length > 0
        ? Math.max(...clients.map((c) => c.id)) + 1
        : 1,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      policyNumber: formData.get("policyNumber"),
    };

    if (editingClient) {
      setClients(
        clients.map((client) =>
          client.id === editingClient.id ? clientData : client
        )
      );
    } else {
      setClients([...clients, clientData]);
    }

    setShowForm(false);
    e.currentTarget.reset();
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
            <form onSubmit={handleFormSubmit} className="space-y-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Client Name"
                  required
                  defaultValue={editingClient?.name || ""}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  defaultValue={editingClient?.email || ""}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  required
                  defaultValue={editingClient?.phone || ""}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="policyNumber"
                  placeholder="Policy Number"
                  required
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
              <tr className="bg-gray-200">
                {["Name", "Email", "Phone", "Policy Number", "Actions"].map(
                  (col, idx) => (
                    <th key={idx} className="px-4 py-2">
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{client.name}</td>
                  <td className="px-4 py-2">{client.email}</td>
                  <td className="px-4 py-2">{client.phone}</td>
                  <td className="px-4 py-2">{client.policyNumber}</td>
                  <td className="px-4 py-2 space-x-2">
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
