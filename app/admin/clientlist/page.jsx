"use client";
import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [editingClient, setEditingClient] = useState(null); // Track the client being edited
  const [userId, setUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch client data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/clients", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("failed to fetch clients");
      const jsonData = await response.json();
      const updatedData = jsonData.data.map((item) => ({
        ...item,
        expiresIn: calculateStatus(item.expirydate),
      }));
      setClients(updatedData);
    } catch (error) {
      console.error("Fetch error", error);
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleChange = (e) => {
    // Directly update the field in the editingClient state
    setEditingClient({
      ...editingClient,
      [e.target.name]: e.target.value,
    });
  };

  // Handle editing an existing client
  const handleEdit = (client) => {
    setEditingClient(client); // Set the client to be edited
    setShowForm(true); // Show the form to edit
  };

  // Handle form submission (both create and update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    const newClient = {
      fullname: editingClient.fullname.trim(),
      email: editingClient.email.trim(),
      phone: editingClient.phone.trim(),
      vehicle: editingClient.vehicle.trim(),
      expirydate: editingClient.expirydate.trim(),
      regnumber: editingClient.regnumber.trim(),
      expiresIn: calculateStatus(editingClient.expirydate),
    };

    // Validate required fields
    for (const key in newClient) {
      if (!newClient[key]) {
        toast.error(`Field "${key}" is required.`);
        return;
      }
    }

    try {
      let response;

      if (editingClient._id) {
        // Update existing client
        console.log("Editing client:", editingClient._id);
        response = await fetch(`/api/clients?id=${editingClient._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClient),
        });
      } else {
        // Create a new client
        console.log("Creating new client...");
        response = await fetch(`/api/clients/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClient),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (editingClient._id) {
        // Update the client list if editing
        setClients((prevClients) =>
          prevClients.map((client) =>
            client._id === editingClient._id ? result.data : client
          )
        );
      } else {
        // Add new client if creating
        setClients((prevClients) => [...prevClients, result.data]);
      }

      // Reset form fields and close form
      setEditingClient(null);
      setShowForm(false);

      // Success notification
      toast.success(
        editingClient._id
          ? "Client updated successfully!"
          : "Client added successfully!"
      );
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(`Failed to submit client: ${error.message}`);
    }
  };

  // Handle client deletion
  const handleDelete = async (clientId) => {
    try {
      const response = await fetch(`/api/clients?id=${clientId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setClients((prevClients) =>
          prevClients.filter((client) => client._id !== clientId)
        );
        toast.success("Client deleted successfully!");
        fetchData(); // Optional: can be omitted as the client list is updated directly
      } else {
        toast.error(data.message || "Failed to delete client");
      }
    } catch (err) {
      toast.error("Error deleting client");
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>{" "}
        {/* Add your loading spinner here */}
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-6 text-[#003366]">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Client Management
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
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
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.regnumber || ""}
                  className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.fullname || ""}
                  className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.email || ""}
                  className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.phone || ""}
                  className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  name="expirydate"
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.expirydate || ""}
                  className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="vehicle"
                  placeholder="Vehicle Model"
                  required
                  onChange={handleChange}
                  defaultValue={editingClient?.vehicle || ""}
                  className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
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
              <tr className="bg-gray-200 text-sm">
                {[
                  "Reg No.",
                  "Owner ",
                  "Email",
                  "Phone",
                  "Vehicle",
                  "Expiry Date",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="border p-3 text-left text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id} className="border-b">
                  <td className="px-3 py-4 text-sm">{client.regnumber}</td>
                  <td className="px-3 py-4 text-sm">{client.fullname}</td>
                  <td className="px-3 py-4 text-sm">{client.email}</td>
                  <td className="px-3 py-4 text-sm">{client.phone}</td>
                  <td className="px-3 py-4 text-sm">{client.vehicle}</td>
                  <td className="px-3 py-4 text-sm">{client.expirydate}</td>
                  <td className="px-3 py-4 text-sm">{client.expiresIn}</td>
                  <td className="px-3 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(client)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      <FaEdit />
                    </button>{" "}
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
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

      <ToastContainer position="top-right" autoClose={5000} />
    </MainLayout>
  );
}

export default ClientList;
