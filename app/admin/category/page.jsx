"use client";
import React from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "../../hooks/useAuth";

function Category() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }
  return (
    <MainLayout>
      <div></div>
    </MainLayout>
  );
}

export default Category;
