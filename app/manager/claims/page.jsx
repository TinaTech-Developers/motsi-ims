"use client";
import { useState } from "react";
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

  const [showClaimForm, setShowClaimForm] = useState(false);

  const toggleForm = () => setShowClaimForm(!showClaimForm);

  const handleAddClaim = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newClaim = {
      id: claims.length + 1,
      clientName: formData.get("clientName"),
      policyNumber: formData.get("policyNumber"),
      claimAmount: parseFloat(formData.get("claimAmount")),
      claimDetails: formData.get("claimDetails"),
      status: "Pending",
      dateSubmitted: new Date().toISOString().split("T")[0],
    };

    setClaims([...claims, newClaim]);
    e.currentTarget.reset();
    setShowClaimForm(false);
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
              onSubmit={handleAddClaim}
              className="space-y-5 border-t border-gray-200 pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
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
                    name="policyNumber"
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
                    name="claimAmount"
                    required
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Claim Details
                  </label>
                  <textarea
                    name="claimDetails"
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
                  {claims.map((claim) => (
                    <tr key={claim.id} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-3">{claim.clientName}</td>
                      <td className="px-4 py-3">{claim.policyNumber}</td>
                      <td className="px-4 py-3">
                        ${claim.claimAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">{claim.claimDetails}</td>
                      <td
                        className={`px-4 py-3 font-semibold ${
                          claim.status === "Approved"
                            ? "text-green-500"
                            : claim.status === "Pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {claim.status}
                      </td>
                      <td className="px-4 py-3">{claim.dateSubmitted}</td>
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
