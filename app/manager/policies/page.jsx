"use client";

import { useState } from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function Page() {
  const { isLoading } = useAuth();

  const [showCreatePolicyForm, setShowCreatePolicyForm] = useState(false);
  const [policies, setPolicies] = useState([
    {
      id: 1,
      policyNumber: "POL12345",
      name: "John Doe",
      type: "Comprehensive",
      expiry: "2025-05-20",
    },
    {
      id: 2,
      policyNumber: "POL12346",
      name: "Jane Smith",
      type: "Third-Party",
      expiry: "2025-06-10",
    },
  ]);

  const handleToggleForm = () => {
    setShowCreatePolicyForm(!showCreatePolicyForm);
  };

  const handleSubmitPolicy = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newPolicy = {
      id: policies.length + 1,
      policyNumber: formData.get("policyNumber"),
      name: formData.get("name"),
      type: formData.get("type"),
      expiry: formData.get("expiry"),
    };

    setPolicies([...policies, newPolicy]);
    setShowCreatePolicyForm(false);
    form.reset();
  };

  if (isLoading) {
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-4 text-[#003366]">
        <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Policy Management</h2>

          <button
            onClick={handleToggleForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-700"
          >
            {showCreatePolicyForm ? "Cancel" : "Create New Policy"}
          </button>

          {showCreatePolicyForm && (
            <form onSubmit={handleSubmitPolicy} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy Number
                </label>
                <input
                  type="text"
                  name="policyNumber"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy Holder Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy Type
                </label>
                <select
                  name="type"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Comprehensive">Comprehensive</option>
                  <option value="Third-Party">Third-Party</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiry"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Create Policy
              </button>
            </form>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-4">Existing Policies</h3>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">
                    Policy Number
                  </th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">
                    Policy Holder
                  </th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">
                    Policy Type
                  </th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id} className="border-b">
                    <td className="py-2 px-4 text-gray-700">
                      {policy.policyNumber}
                    </td>
                    <td className="py-2 px-4 text-gray-700">{policy.name}</td>
                    <td className="py-2 px-4 text-gray-700">{policy.type}</td>
                    <td className="py-2 px-4 text-gray-700">{policy.expiry}</td>
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
