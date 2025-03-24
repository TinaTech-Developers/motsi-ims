"use client";
import useAuth from "../../hooks/useAuth";
import MainLayout from "../components/MainLayout";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const AdminPoliciesPage = () => {
  const { isLoading } = useAuth();

  const [policies, setPolicies] = useState([
    {
      id: 1,
      vehicleId: "XYZ1234",
      ownerName: "John Doe",
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      status: "Active",
      premium: 1000,
    },
    {
      id: 2,
      vehicleId: "ABC5678",
      ownerName: "Jane Smith",
      startDate: "2023-02-15",
      endDate: "2024-02-15",
      status: "Expired",
      premium: 1200,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    vehicleId: "",
    ownerName: "",
    startDate: "",
    endDate: "",
    status: "Active",
    premium: 0,
  });

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingPolicy(null);
    setNewPolicy({
      vehicleId: "",
      ownerName: "",
      startDate: "",
      endDate: "",
      status: "Active",
      premium: 0,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const policyData = {
      id: editingPolicy
        ? editingPolicy.id
        : policies.length > 0
        ? Math.max(...policies.map((p) => p.id)) + 1
        : 1,
      vehicleId: newPolicy.vehicleId,
      ownerName: newPolicy.ownerName,
      startDate: newPolicy.startDate,
      endDate: newPolicy.endDate,
      status: newPolicy.status,
      premium: Number(newPolicy.premium),
    };

    if (editingPolicy) {
      setPolicies(
        policies.map((p) => (p.id === editingPolicy.id ? policyData : p))
      );
    } else {
      setPolicies([...policies, policyData]);
    }

    toggleForm();
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    setNewPolicy({
      vehicleId: policy.vehicleId,
      ownerName: policy.ownerName,
      startDate: policy.startDate,
      endDate: policy.endDate,
      status: policy.status,
      premium: policy.premium,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      setPolicies(policies.filter((policy) => policy.id !== id));
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-6 text-[#003366]">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Policy Management
            </h2>
            <button
              onClick={toggleForm}
              className={`px-4 py-2 rounded text-white ${
                showForm
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {showForm ? "- Cancel" : "+ Add Policy"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleFormSubmit} className="space-y-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Vehicle ID"
                  required
                  value={newPolicy.vehicleId}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, vehicleId: e.target.value })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Owner Name"
                  required
                  value={newPolicy.ownerName}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, ownerName: e.target.value })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  required
                  value={newPolicy.startDate}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, startDate: e.target.value })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  required
                  value={newPolicy.endDate}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, endDate: e.target.value })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Premium"
                  required
                  value={newPolicy.premium}
                  onChange={(e) =>
                    setNewPolicy({
                      ...newPolicy,
                      premium: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newPolicy.status}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, status: e.target.value })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {editingPolicy ? "Update Policy" : "Add Policy"}
              </button>
            </form>
          )}

          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "Vehicle ID",
                  "Owner Name",
                  "Start Date",
                  "End Date",
                  "Status",
                  "Premium",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="px-4 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{policy.vehicleId}</td>
                  <td className="px-4 py-2">{policy.ownerName}</td>
                  <td className="px-4 py-2">{policy.startDate}</td>
                  <td className="px-4 py-2">{policy.endDate}</td>
                  <td className="px-4 py-2">{policy.status}</td>
                  <td className="px-4 py-2">${policy.premium}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(policy.id)}
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
};

export default AdminPoliciesPage;
