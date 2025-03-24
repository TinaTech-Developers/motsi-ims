"use client";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdAccountCircle } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        fetchUserDetails(decodedUser.userId, token);
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    } else {
      console.log("No token found.");
    }
  }, []);

  const fetchUserDetails = async (userId, token) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user details.");

      const { user } = await res.json();
      localStorage.setItem("userId", user._id);
      setUser(user);
    } catch (error) {
      console.error("Fetch user details error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-between h-16 px-6 shadow-2xl bg-white text-[#003368]">
      <div className="flex items-center gap-4">
        <GiHamburgerMenu size={28} color="#003366" />
        <h1 className="text-2xl font-semibold text-[#003366]">
          Vehicle Insurance Management System
        </h1>
      </div>

      <div
        className="relative flex items-center gap-2 cursor-pointer"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <MdAccountCircle size={34} color="#003366" />
        <h1 className="text-lg font-medium text-[#003368]">
          {user ? user.role : "Guest"}
        </h1>

        {isDropdownOpen && user && (
          <div className="absolute right-0 top-10 w-56 bg-white border border-gray-200 shadow-lg rounded-md p-4 z-20">
            <p className="text-xs text-gray-700 mt-2">
              <strong>Full Name:</strong> {user.fullname}
            </p>
            <p className="text-xs text-gray-700 mt-2">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-xs text-gray-700 mt-2">
              <strong>Role:</strong> {user.role}
            </p>
            <p className="text-xs text-gray-700 mt-2">
              <strong>Id:</strong> {user._id}
            </p>

            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 text-white py-1 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
