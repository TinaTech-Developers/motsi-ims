"use client";
import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import useAuth from "@/hooks/useAuth";

function Page() {
  const { isLoading } = useAuth();

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Comprehensive",
      description: "Full coverage insurance",
      details:
        "Comprehensive motor insurance provides extensive coverage for your vehicle, protecting it against damage from accidents, theft, vandalism, fire, weather events, and collisions with animals. It also includes third-party liability, covering damages to other people's property or vehicles if you're at fault in an accident. This type of insurance ensures that whether your car is stolen, damaged in a storm, or involved in a collision, you're financially protected, offering peace of mind. Although it tends to be more expensive than other insurance types, its broad coverage makes it ideal for those seeking full protection for their vehicle.",
    },
    {
      id: 2,
      name: "Third-Party",
      description: "Covers damage to others only",
      details:
        "Third-party motor insurance is the most basic and affordable type of car insurance, offering coverage for damages and injuries you cause to other people, their vehicles, and property in an accident where you're at fault. It does not cover any damage to your own vehicle, but it typically includes liability for medical costs and property damage caused to others. While it provides legal and financial protection in case you're responsible for an accident, it leaves you vulnerable to repair or replacement costs for your own car. This type of insurance is often the minimum required by law in many places due to its essential coverage for third-party claims.",
    },
    {
      id: 3,
      name: "Collision",
      description: "Covers vehicle damage in accidents",
      details:
        "Collision motor insurance covers the cost of repairing or replacing your vehicle if it’s damaged in a crash, regardless of who is at fault. This includes accidents where you hit another vehicle, an object (like a tree or a fence), or even if you roll your car. However, it doesn't cover damages to other vehicles or property—that would be addressed by third-party insurance. Collision coverage is beneficial for drivers who want protection for their own vehicle in case of an accident, especially if their car is newer or valuable, but it typically comes at an additional cost on top of basic liability insurance.",
    },
  ]);

  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleForm = () => setShowAddCategoryForm(!showAddCategoryForm);

  const handleAddCategory = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newCategory = {
      id: categories.length + 1,
      name: formData.get("name"),
      description: formData.get("description"),
      details: formData.get("details"), // Optional field for additional information
    };

    setCategories([...categories, newCategory]);
    setShowAddCategoryForm(false);
    form.reset();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Details
                </label>
                <textarea
                  name="details"
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
                  <tr
                    key={category.id}
                    className="border-b cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <td className="py-2 px-4 text-gray-700">{category.name}</td>
                    <td className="py-2 px-4 text-gray-700">
                      {category.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedCategory && (
            <div className="mt-6 p-4 bg-blue-100 rounded-md">
              <h4 className="font-semibold text-lg">
                Details for {selectedCategory.name}
              </h4>
              <p>{selectedCategory.details}</p>
              <button
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={() => setSelectedCategory(null)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Page;
