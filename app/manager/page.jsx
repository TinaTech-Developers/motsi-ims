"use client";
import MainLayout from "./components/MainLayout";
import { FaFileAlt, FaUsers, FaCarCrash } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { Line, Pie, Bar } from "react-chartjs-2";
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

export default function Dashboard() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const metrics = [
    { title: "Total Clients", count: 120, icon: <FaUsers size={24} /> },
    { title: "Active Policies", count: 75, icon: <FaFileAlt size={24} /> },
    { title: "Pending Claims", count: 15, icon: <FaCarCrash size={24} /> },
    {
      title: "Transactions Today",
      count: 45,
      icon: <AiOutlineTransaction size={24} />,
    },
  ];

  // Sample chart data
  const claimsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Claims Filed",
        data: [5, 9, 7, 12, 8, 6, 11],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const policyDistributionData = {
    labels: ["Comprehensive", "Third-Party"],
    datasets: [
      {
        label: "Policy Types",
        data: [65, 35],
        backgroundColor: ["#4F46E5", "#10B981"],
      },
    ],
  };

  const transactionsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Transactions",
        data: [45, 60, 55, 70, 65, 50, 75],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py- px-6 text-[#003366]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">My Dashboard</h1>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-white shadow rounded-lg p-6 flex items-center"
              >
                <div className="p-4 bg-indigo-500 text-white rounded-full">
                  {metric.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{metric.title}</h3>
                  <p className="text-2xl font-bold">{metric.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Claims Over Time</h2>
              <Line data={claimsData} />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Policy Type Distribution
              </h2>
              <Pie data={policyDistributionData} />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Monthly Transactions
              </h2>
              <Bar data={transactionsData} />
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
            <table className="min-w-full border border-gray-300 table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-left">Activity</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    client: "John Doe",
                    activity: "Claim Filed",
                    date: "2025-03-19",
                    status: "Pending",
                  },
                  {
                    client: "Jane Smith",
                    activity: "Policy Renewed",
                    date: "2025-03-18",
                    status: "Completed",
                  },
                  {
                    client: "Alice Johnson",
                    activity: "New Policy Created",
                    date: "2025-03-17",
                    status: "Completed",
                  },
                  {
                    client: "Bob Brown",
                    activity: "Claim Approved",
                    date: "2025-03-16",
                    status: "Approved",
                  },
                ].map((act, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-3">{act.client}</td>
                    <td className="px-4 py-3">{act.activity}</td>
                    <td className="px-4 py-3">{act.date}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        act.status === "Pending"
                          ? "text-yellow-500"
                          : act.status === "Approved"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {act.status}
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
