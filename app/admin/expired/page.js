"use client";
import React from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "@/hooks/useAuth";
import ExpiredInsurance from "./_components/expiredinsurances";

function page() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }
  return (
    <MainLayout>
      <div className="w-full h-full bg-white text-black">
        <ExpiredInsurance />
      </div>
    </MainLayout>
  );
}

export default page;
