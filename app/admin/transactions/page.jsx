"use client";
import MainLayout from "../components/MainLayout";
import { useState, FormEvent } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import useAuth from "@/hooks/useAuth";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const reportData = [
  {
    date: "2023-01-01",
    totalPolicies: 80,
    claimsFiled: 5,
    premiumCollected: 8000,
  },
  {
    date: "2023-02-01",
    totalPolicies: 85,
    claimsFiled: 7,
    premiumCollected: 8500,
  },
  {
    date: "2023-03-01",
    totalPolicies: 90,
    claimsFiled: 6,
    premiumCollected: 9000,
  },
  {
    date: "2023-04-01",
    totalPolicies: 95,
    claimsFiled: 8,
    premiumCollected: 9500,
  },
  {
    date: "2023-05-01",
    totalPolicies: 100,
    claimsFiled: 4,
    premiumCollected: 10000,
  },
];

const Page = () => {
  const { isLoading } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [policyType, setPolicyType] = useState("All");
  const [status, setStatus] = useState("All");

  const handleFilter = (e) => {
    e.preventDefault();
    // Filtering logic goes here
  };

  const lineData = {
    labels: reportData.map((data) => data.date),
    datasets: [
      {
        label: "Claims Filed",
        data: reportData.map((data) => data.claimsFiled),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: reportData.map((data) => data.date),
    datasets: [
      {
        label: "Total Policies",
        data: reportData.map((data) => data.totalPolicies),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Active", "Expired", "Pending"],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: ["#4F46E5", "#EF4444", "#F59E0B"],
      },
    ],
  };

  if (isLoading) {
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Reports
          </h1>

          {/* Filter Section */}
          <form
            onSubmit={handleFilter}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Policy Type
              </label>
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="All">All</option>
                <option value="Comprehensive">Comprehensive</option>
                <option value="Third-Party">Third-Party</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="col-span-4 text-right">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Apply Filters
              </button>
            </div>
          </form>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Claims Over Time
              </h2>
              <Line data={lineData} />
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Policy Distribution
              </h2>
              <Pie data={pieData} />
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Policies Over Time
              </h2>
              <Bar data={barData} />
            </div>
          </div>

          {/* Export Buttons */}
          <div className="mt-6 text-right">
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Export CSV
            </button>
            <button className="bg-red-600 text-white px-6 py-2 rounded ml-4 hover:bg-red-700">
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Page;
