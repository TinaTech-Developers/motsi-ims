"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import Image from "next/image";
import Link from "next/link";
import { FaListUl, FaArrowRight } from "react-icons/fa";
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
import { BsPeople } from "react-icons/bs";

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

const calculateStatus = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";
  if (diffDays <= 30) return "About to Expire";
  return "Active";
};

function HomePage() {
  const { isLoading } = useAuth();
  const [data, setData] = useState([]);
  const [insurances, setInsurances] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) throw new Error("Failed to fetch clients");
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error("Client Fetch Error", error);
        alert("Failed to fetch clients data");
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();

        const updatedData = jsonData.data.map((item) => ({
          ...item,
          expiresIn: calculateStatus(item.zinaraend),
        }));

        // Save all updated data to state, not just expired
        setInsurances(updatedData);
      } catch (error) {
        console.error("Fetch Error", error);
        alert("Failed to fetch insurance data");
      }
    };

    fetchData();
  }, []);

  if (isLoading) return null;

  const metrics = [
    {
      title: "Total Clients",
      count: insurances.length,
      icon: <BsPeople size={24} />,
      href: "/admin/clientlist",
    },
    {
      title: "Active Policies",
      count: insurances.filter((client) => client.expiresIn === "Active")
        .length,
      icon: <IoDocumentTextSharp color="green" size={24} />,
      href: "/admin",
    },
    {
      title: "Inactive Policies",
      count: insurances.filter((client) => client.expiresIn === "Expired")
        .length,
      icon: <IoDocumentTextSharp color="red" size={24} />,
      href: "/admin/expired",
    },
    {
      title: "Insured Vehicles",
      count: insurances.length,
      icon: <IoDocumentTextSharp size={24} />,
      href: "/admin/insurances",
    },
    {
      title: "About to Expire",
      count: insurances.filter(
        (client) => client.expiresIn === "About to Expire"
      ).length,
      icon: <IoDocumentTextSharp color="orange" size={24} />,
      href: "/admin/abouttoexpire",
    },
  ];

  const monthlyCounts = Array.from(
    { length: 12 },
    (_, month) =>
      insurances.filter(
        (client) => new Date(client.zinarastarts).getMonth() === month
      ).length
  );

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Transactions",
        data: monthlyCounts,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
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

  const policyDistributionData = {
    labels: ["Clarion", "Cell", "Hamilton"],
    datasets: [
      {
        label: "Insurances",
        data: [
          insurances.filter((client) => client.insurance === "Clarion").length,
          insurances.filter((client) => client.insurance === "Cell").length,
          insurances.filter((client) => client.insurance === "Hamilton").length,
        ],
        backgroundColor: ["#4F46E5", "#10B981", "#003366"],
      },
    ],
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-6 text-[#003366]">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        {/* Metric Cards with Manual Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, idx) => (
            <Link
              key={idx}
              href={metric.href}
              className="bg-white shadow hover:shadow-md rounded-lg p-6 flex items-center transition-all duration-200"
            >
              <div className="p-4 bg-blue-500 text-white rounded-full">
                {metric.icon}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{metric.title}</h3>
                <p className="text-2xl font-bold">{metric.count}</p>
              </div>
              <FaArrowRight className="text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Charts */}
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
              Policy Type Distribution
            </h2>
            <Pie data={policyDistributionData} />
          </div>
        </div>

        {/* Image Overview */}
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
              <p className="text-2xl font-bold">{insurances.length}</p>
            </div>
            <div className="p-4 bg-blue-500 text-white rounded-lg">
              <h3 className="text-lg font-medium">Active Policies</h3>
              <p className="text-2xl font-bold">
                {
                  insurances.filter((client) => client.expiresIn === "Active")
                    .length
                }
              </p>
            </div>
            <div className="p-4 bg-red-500 text-white rounded-lg">
              <h3 className="text-lg font-medium">Expired Insurances</h3>
              <p className="text-2xl font-bold">
                {
                  insurances.filter((client) => client.expiresIn === "Expired")
                    .length
                }
              </p>
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
