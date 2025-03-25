"use client";

import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function ClientList() {
  const { isLoading } = useAuth();

  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    vehicle: "",
  });
  const [showAddClientForm, setShowAddClientForm] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setData([]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/clients/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch data.");

        const jsonData = await response.json();
        const updatedData = jsonData.data.map((item) => ({
          ...item,
        }));
        setData(updatedData);
      } catch (error) {
        console.error("Fetch Error:", error);
        alert(`Failed to fetch clients: ${error.message}`);
      }
    };

    fetchData();
  }, [userId]);

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

  const toggleForm = () => setShowAddClientForm(!showAddClientForm);

  if (isLoading) return <p>Loading...</p>;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-6 text-[#003366]">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Client Management</h2>

          <button
            onClick={toggleForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6"
          >
            {showAddClientForm ? "Cancel" : "Add New Client"}
          </button>

          {showAddClientForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                required
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
              />
              <input
                type="text"
                name="vehicle"
                placeholder="Vehicle"
                required
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Add Client
              </button>
            </form>
          )}

          <h3 className="text-xl font-semibold mb-4">Client List</h3>
          {data.length > 0 ? (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Vehicle</th>
                </tr>
              </thead>
              <tbody>
                {data.map((client) => (
                  <tr key={client._id}>
                    <td className="text-center py-2">{client.fullname}</td>
                    <td className="text-center py-2">{client.email}</td>
                    <td className="text-center py-2">{client.phone}</td>
                    <td className="text-center py-2">{client.vehicle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No clients found.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
