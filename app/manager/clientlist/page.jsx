"use client";
import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";

const calculateStatus = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";
  if (diffDays <= 30) return "About to Expire";
  return "Active";
};

function ClientList() {
  const { isLoading } = useAuth();

  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    vehicle: "",
    expirydate: "",
    regnumber: "",
  });
  const [userId, setUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch client data
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
          expiresIn: calculateStatus(item.expirydate),
        }));
        setClients(updatedData);
      } catch (error) {
        console.error("Fetch error", error);
        alert("Failed to fetch clients");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
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

    const newClient = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      vehicle: formData.vehicle.trim(),
      expirydate: formData.expirydate.trim(),
      regnumber: formData.regnumber.trim(),
      expiresIn: calculateStatus(formData.expirydate),
    };

    // Validate required fields
    for (const key in newClient) {
      if (!newClient[key]) {
        alert(`Field "${key}" is required.`);
        return;
      }
    }

    try {
      const response = await fetch(`/api/clients/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setClients((prevClients) => [...prevClients, result.data]); // Add the new client to the list
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        vehicle: "",
        expirydate: "",
        regnumber: "",
      }); // Reset form fields
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error("Submit Error:", error);
      alert(`Failed to submit client: ${error.message}`);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // delete client
  const handleDelete = async (clientId) => {
    try {
      const response = await fetch(`/api/clients?id=${clientId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the deleted vehicle from the data array in state
        setData(data.filter((client) => client._id !== clientId));
      } else {
        setError(data.message || "Failed to delete vehicle");
      }
    } catch (err) {
      setError("Error deleting vehicle");
    }
  };

  if (isLoading) return null;

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
                  name="regnumber"
                  placeholder="Reg Number"
                  value={formData.regnumber}
                  required
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={formData.fullname}
                  required
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  required
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  required
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
                />
                <input
                  type="date"
                  name="expirydate"
                  value={formData.expirydate}
                  required
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="vehicle"
                  placeholder="Vehicle Model"
                  value={formData.vehicle}
                  required
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Add Client
              </button>
            </form>
          )}

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-sm ">
                {[
                  "Reg No.",
                  "Owner ",
                  "Email",
                  "Phone",
                  "Vehicle",
                  "Expiry Date",
                  "Status",
                  ,
                ].map((col, idx) => (
                  <th key={idx} className="px-4 py-2 text-start">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client._id}
                  className="border-b hover:bg-gray-100 text-sm"
                >
                  <td className="px-4 py-2 text-start">{client.regnumber}</td>
                  <td className="px-4 py-2 text-start">{client.fullname}</td>
                  <td className="px-4 py-2 text-start">{client.email}</td>
                  <td className="px-4 py-2 text-start">{client.phone}</td>
                  <td className="px-4 py-2 text-start">{client.vehicle}</td>
                  <td className="px-4 py-2 text-start">{client.expirydate}</td>
                  <td
                    className={`px-4 py-2 text-start ${
                      client.expiresIn === "Active"
                        ? "text-green-800"
                        : client.expiresIn === "About to Expire"
                        ? "text-yellow-400"
                        : "text-red-800"
                    }`}
                  >
                    {client.expiresIn}
                  </td>
                  {/* <td className="px-4 py-2 text-start space-x-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-blue-600 hover:underline"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="text-red-600 hover:underline"
                    >
                      <FaTrashAlt />
                    </button> */}
                  {/* </td> */}
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
