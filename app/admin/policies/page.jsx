"use client";
import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import MainLayout from "../components/MainLayout";
import { FaTrashAlt } from "react-icons/fa";
import Error from "next/error";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPoliciesPage = () => {
  const { isLoading } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setData([]);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/policies", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch Policies");
        const jsonData = await response.json();
        const updatedData = jsonData.data.map((item) => ({
          ...item,
        }));
        setPolicies(updatedData);
      } catch (error) {
        console.error("Fetch error", error);
        alert("Failed to fetch policies data");
      }
    };

    // Ensure fetchData runs only once after component mounts
    fetchData();
  }, []); // Empty array ensures this runs only on mount

  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    policynumber: "",
    policyholder: "",
    policytype: "",
    expirydate: "",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingPolicy(null);
    setNewPolicy({
      policynumber: "",
      policyholder: "",
      policytype: "",
      expirydate: "",
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Prepare the policy data
    const policyData = {
      id: editingPolicy
        ? editingPolicy.id
        : policies.length > 0
        ? Math.max(...policies.map((p) => p.id)) + 1
        : 1,
      policynumber: newPolicy.policynumber,
      policyholder: newPolicy.policyholder,
      policytype: newPolicy.policytype,
      expirydate: newPolicy.expirydate,
    };

    // Call handleSubmit to actually submit the data
    handleSubmit(policyData);
  };

  const handleSubmit = async (policyData) => {
    // Removed the call to policyData.preventDefault()

    console.log("Form Data Before Submit: ", policyData); // Check the form data before submitting.

    if (!userId) {
      alert("User Not Logged in");
      return;
    }

    const newPolicy = {
      policynumber: policyData.policynumber.trim(),
      policyholder: policyData.policyholder.trim(),
      policytype: policyData.policytype.trim(),
      expirydate: policyData.expirydate.trim(),
    };

    for (const key in newPolicy) {
      if (!newPolicy[key]) {
        toast.error(`Field "${key}" is required.`);
        return;
      }
    }

    try {
      const response = await fetch(`/api/policies/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPolicy),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const result = await response.json();
      setData([...data, result.data]);

      // Reset the form data
      setNewPolicy({
        policynumber: "",
        policyholder: "",
        policytype: "",
        expirydate: "",
      });
      toast.success("Policy added successfully!");
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(`Failed to submit policy: ${error.message}`);
    }
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    setNewPolicy({
      policynumber: policy.policynumber,
      policyholder: policy.policyholder,
      policytype: policy.policytype,
      expirydate: policy.expirydate,
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
                  placeholder="Pocicy Number e.g POL123"
                  required
                  value={newPolicy.policynumber}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, policynumber: e.target.value })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Policy Holder Name"
                  required
                  value={newPolicy.policyholder}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, policyholder: e.target.value })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={newPolicy.policytype}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, policytype: e.target.value })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Comprehensive">Comprehensive</option>
                  <option value="Third-Party">Third-Party</option>
                </select>
                <input
                  type="date"
                  placeholder="Expiry Date"
                  required
                  value={newPolicy.expirydate}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, expirydate: e.target.value })
                  }
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                />
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
                  "Policy Number",
                  "Policy Holder",
                  "Policy Type",
                  "Expiry Date",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="px-4 py-2 text-start">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy._id || policy.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{policy.policynumber}</td>
                  <td className="px-4 py-2">{policy.policyholder}</td>
                  <td className="px-4 py-2">{policy.policytype}</td>
                  <td className="px-4 py-2">{policy.expirydate}</td>
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
      <ToastContainer />
    </MainLayout>
  );
};

export default AdminPoliciesPage;
