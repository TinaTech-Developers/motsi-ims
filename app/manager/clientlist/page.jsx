"use client";

import { useState } from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function ClientList() {
  const { isLoading } = useAuth();

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      policyNumber: "POL12345",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      policyNumber: "POL12346",
    },
  ]);

  const [showAddClientForm, setShowAddClientForm] = useState(false);

  const toggleForm = () => setShowAddClientForm(!showAddClientForm);

  const handleAddClient = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newClient = {
      id: clients.length + 1,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      policyNumber: formData.get("policyNumber"),
    };

    setClients([...clients, newClient]);
    e.currentTarget.reset();
    setShowAddClientForm(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-6 text-[#003366]">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Client Management</h2>

          <button
            onClick={toggleForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none mb-6"
          >
            {showAddClientForm ? "Cancel" : "Add New Client"}
          </button>

          {showAddClientForm && (
            <form onSubmit={handleAddClient} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy Number
                </label>
                <input
                  type="text"
                  name="policyNumber"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Add Client
              </button>
            </form>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-4">Client List</h3>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {["Name", "Email", "Phone", "Policy Number"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b">
                    <td className="px-4 py-2">{client.name}</td>
                    <td className="px-4 py-2">{client.email}</td>
                    <td className="px-4 py-2">{client.phone}</td>
                    <td className="px-4 py-2">{client.policyNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
