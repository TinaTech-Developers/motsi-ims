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
import { useEffect, useState } from "react";

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
  const { isLoading } = useAuth() || { isLoading: false };
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [clarionCount, setClarionCount] = useState(0);

  // Initialize userId from localStorage when the component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setData([]); // Set empty data if userId is not found
  }, []);

  // Calculate the status based on the 'zinaraend' date
  const calculateStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    // Normalize the date to remove time part (if necessary) for correct comparison
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const timeDiff = expiry - today; // Time difference in milliseconds
    const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const daysUntilExpiry = timeDiff / oneDayInMs; // Days until expiry

    if (expiry < today) return "Expired"; // If the expiry date has passed
    if (daysUntilExpiry <= 7) return "About to Expire"; // If within the next 7 days
    return "Active"; // Otherwise, it's active
  };

  // Fetch data once userId is available
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return; // If no userId, do not fetch data

      try {
        const response = await fetch(`/api/data/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok)
          throw new Error(`Failed to fetch data. Status: ${response.status}`);

        const jsonData = await response.json();

        // Set the full data for further processing
        setData(jsonData.data);

        // Set the clarion count directly from the API response
        setClarionCount(jsonData.clarionCount);
      } catch (error) {
        console.error("Fetch Error:", error);
        alert(`Failed to fetch insurance data: ${error.message}`);
      }
    };

    fetchData();
  }, [userId]);

  // Calculate Clarion count after data is set
  useEffect(() => {
    if (data.length > 0) {
      const clarionCount = data.filter(
        (item) => item.insuranceProvider === "Clarion"
      ).length;
      setClarionCount(clarionCount); // Store the count in the state
    }
  }, [data]); // This will run whenever `data` changes

  const policyDistributionData = {
    labels: ["Clarion", "Cell", "Hamilton"], // Labels for your Pie chart
    datasets: [
      {
        label: "Insurances",
        data: [clarionCount, 1, 1], // Using clarionCount directly from the API
        backgroundColor: ["#4F46E5", "#10B981", "#003366"], // Color for each section of the pie chart
      },
    ],
  };

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

  if (isLoading) {
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py- px-6 text-[#003366]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">My Dashboard</h1>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Clients",
                count: data.length,
                icon: <FaUsers size={24} />,
              },
              {
                title: "Active Policies",
                count: data.filter((client) => client.expiresIn === "Active")
                  .length,
                icon: <FaFileAlt size={24} />,
              },
              {
                title: "About to Expire",
                count: data.filter(
                  (client) => client.expiresIn === "About to Expire"
                ).length,
                icon: <FaCarCrash size={24} />,
              },
              {
                title: "Expired Policies",
                count: data.filter((client) => client.expiresIn === "Expired")
                  .length,
                icon: <AiOutlineTransaction size={24} />,
              },
            ].map((metric, idx) => (
              <div
                key={idx}
                className="bg-white shadow rounded-lg p-6 flex items-center "
              >
                <div className="p-4 bg-indigo-500 text-white rounded-full">
                  {metric.icon}
                </div>
                <div className="flex flex-col items-center justify-center ml-4">
                  <h3 className="text- font-semibold">{metric.title}</h3>
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
        </div>
      </div>
    </MainLayout>
  );
}
