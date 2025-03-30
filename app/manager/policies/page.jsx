"use client";

import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function Page() {
  const { isLoading } = useAuth();

  const [showCreatePolicyForm, setShowCreatePolicyForm] = useState(false);

  const handleToggleForm = () => {
    setShowCreatePolicyForm(!showCreatePolicyForm);
  };

  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    policynumber: "",
    policyholder: "",
    policytype: "",
    expirydate: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setData([]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/policies/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch client policies");
        const jsonData = await response.json();
        const updatedData = jsonData.data.map((item) => ({
          ...item,
        }));
        setData(updatedData);
      } catch (error) {
        console.error("Fetch Error:", error);
        alert(`Failed to fetch clients policies: ${error.message}`);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data Before Submit: ", formData); // Check the form data before submitting.

    if (!userId) {
      alert("User Not Logged in");
      return;
    }

    const newPolicy = {
      policynumber: formData.policynumber.trim(),
      policyholder: formData.policyholder.trim(),
      policytype: formData.policytype.trim(),
      expirydate: formData.expirydate.trim(),
    };

    for (const key in newPolicy) {
      if (!newPolicy[key]) {
        alert(`Field "${key}" is required.`);
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

      setFormData({
        policynumber: "",
        policyholder: "",
        policytype: "",
        expirydate: "",
      });
    } catch (error) {
      console.error("Submit Error:", error);
      alert(`Failed to submit claim: ${error.message}`);
    }
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
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy Number
                </label>
                <input
                  type="text"
                  name="policynumber"
                  value={formData.policynumber}
                  onChange={handleChange}
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
                  name="policyholder"
                  value={formData.policyholder}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy Type
                </label>
                <select
                  name="policytype"
                  value={formData.policytype}
                  onChange={handleChange}
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
                  name="expirydate"
                  value={formData.expirydate}
                  onChange={handleChange}
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
                {data.map((policy) => (
                  <tr key={policy._id} className="border-b">
                    <td className="py-2 px-4 text-gray-700">
                      {policy.policynumber}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {policy.policyholder}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {policy.policytype}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {policy.expirydate}
                    </td>
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
