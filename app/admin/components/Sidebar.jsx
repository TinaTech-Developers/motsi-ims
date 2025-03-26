"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoPeopleSharp, IoDocumentTextSharp } from "react-icons/io5";
import { FaFileAlt, FaListUl } from "react-icons/fa";
import { BsPerson } from "react-icons/bs";

function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="w-48 h-screen bg-blue-950 py-10 p-4 shadow-2xl">
      <div className="flex items-center justify-start">
        <div className="flex items-center justify-start gap-2">
          <Image
            src="/pngt.png"
            alt="Logo"
            height={200}
            width={200}
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-2xl font-semibold text-white">MIMS</h1>
        </div>
      </div>

      <ul className="flex flex-col justify-center mt-4 ml-6">
        <li>
          <Link
            href="/admin/home"
            className={`flex items-center justify-start gap-4 p-2 rounded ${
              isActive("/admin/home")
                ? "text-blue-500 bg-white"
                : "hover:text-blue-500 hover:bg-white text-white"
            }`}
          >
            <AiOutlineDashboard
              className={`${
                isActive("/admin/home")
                  ? "text-blue-500"
                  : "hover:text-blue-500"
              }`}
              size={22}
            />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/clientlist"
            className={`flex items-center justify-start gap-4 p-2 rounded ${
              isActive("/admin/clientlist")
                ? "text-blue-500 bg-white"
                : "hover:text-blue-500 hover:bg-white text-white"
            }`}
          >
            <IoPeopleSharp
              className={`${
                isActive("/admin/clientlist")
                  ? "text-blue-500"
                  : "hover:text-blue-500"
              }`}
              size={22}
            />
            Client List
          </Link>
        </li>
        <li>
          <Link
            href="/admin/insurances"
            className={`flex items-center justify-start gap-4 p-2 rounded ${
              isActive("/admin/insurances")
                ? "text-blue-500 bg-white"
                : "hover:text-blue-500 hover:bg-white text-white"
            }`}
          >
            <IoDocumentTextSharp
              className={`${
                isActive("/admin/insurances")
                  ? "text-blue-500"
                  : "hover:text-blue-500"
              }`}
              size={22}
            />
            Insurances
          </Link>
        </li>
      </ul>

      <h1 className="font-semibold my-6 pl-3 text-xl text-white">Report</h1>
      <ul className="flex flex-col justify-center mt-4 ml-6">
        <li>
          <Link
            href="/admin/transactions"
            className={`flex items-center justify-start gap-4 p-2 rounded ${
              isActive("/admin/transactions")
                ? "text-blue-500 bg-white"
                : "hover:text-blue-500 hover:bg-white text-white"
            }`}
          >
            <AiOutlineDashboard
              className={`${
                isActive("/admin/transactions")
                  ? "text-blue-500"
                  : "hover:text-blue-500"
              }`}
              size={22}
            />
            Reports
          </Link>
        </li>
      </ul>

      <h1 className="font-semibold my-6 pl-3 text-xl text-white">
        Maintenance
      </h1>
      <ul className="flex flex-col justify-center mt-4 ml-6">
        <li>
          <Link
            href="/admin/category"
            className={`flex items-center justify-start gap-4 p-2 rounded ${
              isActive("/admin/category")
                ? "text-blue-500 bg-white"
                : "hover:text-blue-500 hover:bg-white text-white"
            }`}
          >
            <FaListUl
              className={`${
                isActive("/admin/category")
                  ? "text-blue-500"
                  : "hover:text-blue-500"
              }`}
              size={22}
            />
            Category List
          </Link>
        </li>
        <li>
          <Link
            href="/admin/policies"
            className={`flex items-center justify-start gap-4 p-2 rounded ${
              isActive("/admin/policies")
                ? "text-blue-500 bg-white"
                : "hover:text-blue-500 hover:bg-white text-white"
            }`}
          >
            <FaFileAlt
              className={`${
                isActive("/admin/policies")
                  ? "text-blue-500"
                  : "hover:text-blue-500"
              }`}
              size={22}
            />
            Policies
          </Link>
        </li>
        <li>
          <Link
            href="/admin/profile"
            className={`flex items-center justify-start gap-4 p-2 rounded ${
              isActive("/admin/profile")
                ? "text-blue-500 bg-white"
                : "hover:text-blue-500 hover:bg-white text-white"
            }`}
          >
            <BsPerson
              className={`${
                isActive("/admin/profile")
                  ? "text-blue-500"
                  : "hover:text-blue-500"
              }`}
              size={22}
            />
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
