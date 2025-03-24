"use client";
import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "@/hooks/useAuth";

function Page() {
  const { isLoading } = useAuth();

  const [categories, setCategories] = useState([
    { id: 1, name: "Comprehensive", description: "Full coverage insurance" },
    { id: 2, name: "Third-Party", description: "Covers damage to others only" },
    {
      id: 3,
      name: "Collision",
      description: "Covers vehicle damage in accidents",
    },
  ]);

  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  const toggleForm = () => setShowAddCategoryForm(!showAddCategoryForm);

  const handleAddCategory = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newCategory = {
      id: categories.length + 1,
      name: formData.get("name"),
      description: formData.get("description"),
    };

    setCategories([...categories, newCategory]);
    setShowAddCategoryForm(false);
    form.reset();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-4 text-[#003366]">
        <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Insurance Category Management
          </h2>

          <button
            onClick={toggleForm}
            className={`px-5 py-2 rounded-md focus:outline-none ${
              showAddCategoryForm
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {showAddCategoryForm ? "Cancel" : "Add New Category"}
          </button>

          {showAddCategoryForm && (
            <form onSubmit={handleAddCategory} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md focus:outline-none hover:bg-blue-700"
              >
                Add Category
              </button>
            </form>
          )}

          <div>
            <h3 className="text-xl font-semibold my-4">
              Existing Insurance Categories
            </h3>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">
                    Category Name
                  </th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b">
                    <td className="py-2 px-4 text-gray-700">{category.name}</td>
                    <td className="py-2 px-4 text-gray-700">
                      {category.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Page;
