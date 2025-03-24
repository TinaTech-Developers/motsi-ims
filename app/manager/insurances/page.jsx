"use client";
import React from "react";
import MainLayout from "../components/MainLayout";
import InsuranceTable from "./components/InsuranceTable";
import useAuth from "@/hooks/useAuth";



function Insurance() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }
  return (
    <MainLayout>
      <div className="w-full h-full bg-white text-black">
        <InsuranceTable />
      </div>
    </MainLayout>
  );
}

export default Insurance;
