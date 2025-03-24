import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoPeopleSharp } from "react-icons/io5";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaFileAlt, FaListUl } from "react-icons/fa";
import { BsPerson } from "react-icons/bs";

function Sidebar() {
  return (
    <div className="w-48 h-screen bg-blue-950 py-10 p-4 shadow-2xl">
      <div className="flex items-center justify-start">
        <div className="flex items-center justify-start gap-2">
          <Image
            src="/pngt.png"
            alt=""
            height={200}
            width={200}
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-2xl font-semibold">MIMS</h1>
        </div>
      </div>
      <ul className="flex flex-col  justify-center mt-4 ml-6">
        <li>
          <Link
            className="flex items-center justify-start gap-4  hover:text-blue-500"
            href={"/manager"}
          >
            <AiOutlineDashboard size={22} color="white" />
            <h1>Dashboard</h1>
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center justify-start gap-4 mt-3 hover:text-blue-500"
            href={"/manager/clientlist"}
          >
            <IoPeopleSharp size={22} color="white" />
            <h1>Client List</h1>
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center justify-start gap-4 mt-3 hover:text-blue-500"
            href={"/manager/insurances"}
          >
            <IoDocumentTextSharp size={22} color="white" />
            <h1>Insurances</h1>
          </Link>
        </li>
      </ul>
      <h1 className="font-semibold my-6 pl-3 text-xl">Report</h1>
      <ul className="flex flex-col  justify-center mt-4 ml-6">
        <li>
          <Link
            className="flex items-center justify-center gap-4  hover:text-blue-500"
            href={"/manager/claims"}
          >
            <AiOutlineDashboard size={22} color="white" />
            <h1 className="text-">Clients Claim</h1>
          </Link>
        </li>
      </ul>
      <h1 className="font-semibold my-6 pl-3 text-xl">Maintanance</h1>
      <ul className="flex flex-col  justify-center mt-4 ml-6">
        <li>
          <Link
            className="flex items-center justify-start gap-4 mt-3 hover:text-blue-500"
            href={"/manager/category"}
          >
            <FaListUl size={22} color="white" />
            <h1>Category List</h1>
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center justify-start gap-4 mt-3 hover:text-blue-500"
            href={"/manager/policies"}
          >
            <FaFileAlt size={22} color="white" />
            <h1>Policies</h1>
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center justify-start gap-4 mt-3 hover:text-blue-500"
            href={"/manager/profile"}
          >
            <BsPerson size={22} color="white" />
            <h1>Profile</h1>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
