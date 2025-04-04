"use client";

import React, { useEffect, useState } from "react";
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

function HomePage() {
  const { isLoading } = useAuth();
  const [data, setData] = useState([]);
  const [insurances, setInsurances] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/clients", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();
        const updatedData = jsonData.data.map((item) => ({
          ...item,
        }));
        setData(jsonData.data);
      } catch (error) {
        console.error("Fetch Error", error);
        alert("Failed to fetch insurance data");
      }
    };
    fetchData();
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
        }));
        setInsurances(jsonData.data);
      } catch (error) {
        console.error("Fetch Error", error);
        alert("Failed to fetch insurance data");
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return null; // Alternatively, display a loading spinner
  }

  const metrics = [
    {
      title: "Total Clients",
      count: data.length,
      icon: <BsPeople size={24} />,
    },
    {
      title: "Active Policies",
      count: insurances.filter((client) => client.expiresIn === "Active")
        .length,
      icon: <IoDocumentTextSharp color="green" size={24} />,
    },
    {
      title: "Inactive Policies",
      count: insurances.filter((client) => client.expiresIn === "Expired")
        .length,
      icon: <IoDocumentTextSharp color={"red"} size={24} />,
    },
    {
      title: "Insured Vehicles",
      count: insurances.length,
      icon: <IoDocumentTextSharp size={24} />,
    },
    {
      title: "About to Expire",
      count: insurances.filter(
        (client) => client.expiresIn === "About to Expire"
      ).length,
      icon: <IoDocumentTextSharp color="yellow" size={24} />,
    },
  ];

  const januaryClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 0;
  }).length;

  const febuaryClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 1;
  }).length;

  const marchClientsCount = insurances.filter((client) => {
    const clientStartDate = new Date(client.zinarastart); // Use zinarastart here
    return clientStartDate.getMonth() === 2; // March is month 2 (0-based index)
  }).length;

  const aprilClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 3;
  }).length;

  const mayClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 4;
  }).length;

  const juneClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 5;
  }).length;

  const julyClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 6;
  }).length;

  const augustClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 7;
  }).length;

  const septClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 8;
  }).length;

  const octClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 9;
  }).length;

  const novClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 10;
  }).length;

  const decClientsCount = insurances.filter((client) => {
    const clientDate = new Date(client.zinarastarts);
    return clientDate.getMonth() === 11;
  }).length;

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
        data: [
          januaryClientsCount,
          febuaryClientsCount,
          marchClientsCount,
          aprilClientsCount,
          mayClientsCount,
          juneClientsCount,
          julyClientsCount,
          augustClientsCount,
          septClientsCount,
          octClientsCount,
          novClientsCount,
          decClientsCount,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  // const barData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //   datasets: [
  //     {
  //       label: "Active Policies",
  //       data: [50, 60, 70, 65, 80, 75],
  //       backgroundColor: "rgba(75, 192, 192, 0.6)",
  //     },
  //   ],
  // };

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

  const clarion = insurances.filter(
    (client) => client.insurance === "Clarion"
  ).length;
  const cell = insurances.filter(
    (client) => client.insurance === "Cell"
  ).length;
  const hamilton = insurances.filter(
    (client) => client.insurance === "Hamilton"
  ).length;

  const policyDistributionData = {
    labels: ["Clarion", "Cell", "Hamilton"], // Labels for your Pie chart
    datasets: [
      {
        label: "Insurances",
        data: [clarion, cell, hamilton], // Using clarionCount directly from the API
        backgroundColor: ["#4F46E5", "#10B981", "#003366"], // Color for each section of the pie chart
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
            <Line data={barData} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Policy Type Distribution
            </h2>
            <Pie data={policyDistributionData} />
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
              <p className="text-2xl font-bold">{data.length}</p>
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
