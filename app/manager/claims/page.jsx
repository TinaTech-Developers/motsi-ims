"use client";
import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function Page() {
  const { isLoading } = useAuth();

  const [claims, setClaims] = useState([
    {
      id: 1,
      clientName: "John Doe",
      policyNumber: "POL12345",
      claimAmount: 5000,
      claimDetails: "Rear-end collision repair",
      status: "Pending",
      dateSubmitted: "2025-03-15",
    },
    {
      id: 2,
      clientName: "Jane Smith",
      policyNumber: "POL12346",
      claimAmount: 1200,
      claimDetails: "Windshield replacement",
      status: "Approved",
      dateSubmitted: "2025-03-12",
    },
  ]);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    clientname: "",
    policynumber: "",
    amount: "",
    details: "",
    submissiondate: "",
  });
  const [showClaimForm, setShowClaimForm] = useState(false);

  const toggleForm = () => setShowClaimForm(!showClaimForm);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setData([]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/clientsclaims/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch client claims");
        const jsonData = await response.json();
        const updatedData = jsonData.data.map((item) => ({
          ...item,
        }));
        setData(updatedData);
      } catch (error) {
        console.error("Fetch Error:", error);
        alert(`Failed to fetch clients claims: ${error.message}`);
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
      alert("User Not Logged in");
      return;
    }

    const newClient = {
      clientname: formData.clientname.trim(),
      policynumber: formData.policynumber.trim(),
      amount: formData.amount.trim(),
      details: formData.details.trim(),
      submissiondate: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
    };

    for (const key in newClient) {
      if (!newClient[key]) {
        alert(`Field "${key}" is required.`);
        return;
      }
    }

    try {
      const response = await fetch(`/api/clientsclaims/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setData([...data, result.data]);

      // Reset form after successful submission
      setFormData({
        clientname: "",
        policynumber: "",
        amount: "",
        details: "",
        submissiondate: "",
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
      <div className="min-h-screen bg-gray-100 py-8 px-6 text-[#003366]">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center my-3">
            Policy Claims Management
          </h2>

          <div className="text-right mb-6">
            <button
              onClick={toggleForm}
              className={`px-5 py-2 rounded-md focus:outline-none ${
                showClaimForm
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {showClaimForm ? "Cancel Claim Submission" : "Submit New Claim"}
            </button>
          </div>

          {showClaimForm && (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 border-t border-gray-200 pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="clientname"
                    value={formData.clientname}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

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
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Claim Amount (USD)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Claim Details
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          )}

          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Submitted Claims</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "Client",
                      "Policy Number",
                      "Amount (USD)",
                      "Details",
                      "Status",
                      "Date Submitted",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((claim) => (
                    <tr key={claim._id} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-3">{claim.clientname || "N/A"}</td>
                      <td className="px-4 py-3">
                        {claim.policynumber || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        ${claim.amount ? claim.amount.toFixed(2) : "N/A"}
                      </td>
                      <td className="px-4 py-3">{claim.details || "N/A"}</td>
                      <td
                        className={`px-4 py-3 font-semibold ${
                          claim.status === true || claim.status === "true"
                            ? "text-green-500"
                            : claim.status === false || claim.status === "false"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {claim.status === true || claim.status === "true"
                          ? "Approved"
                          : claim.status === false || claim.status === "false"
                          ? "Pending"
                          : "Unknown"}
                      </td>

                      <td className="px-4 py-3">
                        {claim.submissiondate || "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
