"use client";

import React from "react";
import MainLayout from "../components/MainLayout";
import Image from "next/image";
import { FaListUl } from "react-icons/fa";
import { IoDocumentTextSharp, IoPeopleSharp } from "react-icons/io5";
import { Bar, Line, Pie } from "react-chartjs-2";
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

// Register Chart.js components globally
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

function HomePage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null; // Alternatively, display a loading spinner
  }

  const metrics = [
    { title: "Total Categories", count: 4, icon: <FaListUl size={24} /> },
    {
      title: "Active Policies",
      count: 78,
      icon: <IoDocumentTextSharp size={24} />,
    },
    {
      title: "Inactive Policies",
      count: 22,
      icon: <IoDocumentTextSharp size={24} />,
    },
    {
      title: "Insured Vehicles",
      count: 156,
      icon: <IoDocumentTextSharp size={24} />,
    },
    { title: "Clients", count: 156, icon: <IoPeopleSharp size={24} /> },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Policies",
        data: [50, 60, 70, 65, 80, 75],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const lineData = {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: "Clients Growth",
        data: [50, 120, 200, 250, 320],
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const pieData = {
    labels: ["Active Policies", "Inactive Policies"],
    datasets: [
      {
        data: [78, 22],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py- px-6 text-[#003366]">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-lg p-6 flex items-center"
            >
              <div className="p-4 bg-blue-500 text-white rounded-full">
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
            <h2 className="text-xl font-semibold mb-4">
              Active Policies Over Time
            </h2>
            <Bar data={barData} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Clients Growth Over Years
            </h2>
            <Line data={lineData} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Policy Status Distribution
            </h2>
            <Pie data={pieData} />
          </div>
        </div>

        {/* Image Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Insured Vehicles Overview
          </h2>
          <p className="text-gray-600 mb-4">
            Overview of insured vehicles, policy types, and claim status.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-500 text-white rounded-lg">
              <h3 className="text-lg font-medium">Total Vehicles</h3>
              <p className="text-2xl font-bold">156</p>
            </div>
            <div className="p-4 bg-blue-500 text-white rounded-lg">
              <h3 className="text-lg font-medium">Active Policies</h3>
              <p className="text-2xl font-bold">78</p>
            </div>
            <div className="p-4 bg-red-500 text-white rounded-lg">
              <h3 className="text-lg font-medium">Pending Claims</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>

          <Image
            src="/vehicle.jpg"
            alt="Insured Vehicles"
            width={1200}
            height={800}
            className="w-full h-96 object-cover rounded-lg"
            quality={100}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default HomePage;
