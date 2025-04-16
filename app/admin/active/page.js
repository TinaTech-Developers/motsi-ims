"use client";
import React from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "@/hooks/useAuth";
import ActiveTable from "./_components/activetable";

function page() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }
  return (
    <MainLayout>
      <div className="w-full h-full bg-white text-black">
        <ActiveTable />
      </div>
    </MainLayout>
  );
}

export default page;
