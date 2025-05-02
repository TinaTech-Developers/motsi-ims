"use client";

import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const calculateStatus = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";
  if (diffDays <= 30) return "About to Expire";
  return "Active";
};

const InsuranceTable = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleId: "",
    vehicleName: "",
    ownerName: "",
    endDate: "",
    premium: "",
    phonenumber: "",
    insurance: "",
  });
  const [sortAsc, setSortAsc] = useState(true);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const handleSortByZinaraStart = () => {
    const sorted = [...data].sort((a, b) => {
      const dateA = new Date(a.zinarastart);
      const dateB = new Date(b.zinarastart);
      return sortAsc ? dateA - dateB : dateB - dateA;
    });
    setSortAsc(!sortAsc); // toggle sort direction
    setData(sorted);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setData([]);
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const newData = {
      vehiclereg: formData.vehicleId.trim(),
      vehicleName: formData.vehicleName.trim(),
      ownername: formData.ownerName.trim(),
      zinarastart: new Date().toISOString().split("T")[0],
      zinaraend: formData.endDate.trim(),
      expiresIn: calculateStatus(formData.endDate),
      phonenumber: formData.phonenumber.trim(),
      premium: Number(formData.premium),
      insurance: formData.insurance.trim(),
    };

    for (const key in newData) {
      if (!newData[key]) {
        alert(`Field "${key}" is required.`);
        return;
      }
    }

    if (isNaN(newData.premium) || newData.premium <= 0) {
      alert("Premium must be a valid number greater than zero.");
      return;
    }

    try {
      const response = await fetch(`/api/data/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setData([...data, result.data]); // Add new entry to state
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error("Submit Error:", error);
      alert(`Failed to submit insurance data: ${error.message}`);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/api/data", {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       });
  //       if (!response.ok) throw new Error("Failed to fetch data");
  //       const jsonData = await response.json();

  //       // Update status for each item based on expiry date
  //       const updatedData = jsonData.data.map((item) => ({
  //         ...item,
  //         expiresIn: calculateStatus(item.zinaraend),
  //       }));

  //       setData(updatedData); // Set updated data with status
  //     } catch (error) {
  //       console.error("Fetch Error", error);
  //       alert("Failed to fetch insurance data");
  //     }
  //   };
  //   fetchData();
  // }, []);

  // const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setData([]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/data/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch data.");

        const jsonData = await response.json();

        // Updated data from backend will already have expiresIn calculated
        setData(jsonData.data);
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Failed to fetch insurance data.");
      }
    };

    fetchData();
  }, [userId]);

  const handleDelete = async (vehicleId) => {
    try {
      const response = await fetch(`/api/data?id=${vehicleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to delete vehicle");
        return; // Exit early if the deletion was not successful
      }

      const result = await response.json();
      if (Array.isArray(result)) {
        setData(result); // Directly set the new data array if it's returned
      } else {
        setData((prevData) =>
          prevData.filter((vehicle) => vehicle._id !== vehicleId)
        );
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      setError("Error deleting vehicle");
    }
  };

  const toggleForm = (vehicle = null) => {
    setEditingVehicle(vehicle);
    setShowForm((prevState) => !prevState); // This toggles the form visibility
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const vehicleData = {
      vehicleId: formData.get("vehicleId"),
      vehicleName: formData.get("vehicleName"),
      ownerName: formData.get("ownerName"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      status: formData.get("status"),
      premium: formData.get("premium"),
    };

    if (!vehicleData.vehicleId || !vehicleData.endDate) {
      setError("Vehicle ID and new 'zinaraend' value are required.");
      return;
    }

    if (editingVehicle) {
      try {
        const response = await fetch(`/api/data?id=${editingVehicle._id}`, {
          method: "PUT",
          body: JSON.stringify({ zinaraend: vehicleData.endDate }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
          setData((prevData) =>
            prevData.map((item) =>
              item._id === editingVehicle._id
                ? {
                    ...item,
                    zinaraend: vehicleData.endDate,
                    expiresIn: calculateStatus(vehicleData.endDate),
                  }
                : item
            )
          );
          setShowForm(false);
          setEditingVehicle(null);
        } else {
          setError(data.message || "Failed to update vehicle");
        }
      } catch (error) {
        setError("Error updating vehicle");
      }
    } else {
      handleSubmit();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.vehiclereg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-6">
        {error && (
          <div className="text-red-600 bg-red-100 p-4 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Insurance Records
          </h2>
          <button
            onClick={() => toggleForm()}
            className={`px-4 py-2 rounded text-white ${
              showForm
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {showForm ? "Cancel" : "Add Record"}
          </button>
        </div>

        {/* Search input */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-">
          <input
            type="text"
            placeholder="Search by Vehicle ID"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 w-full md:w-1/4"
          />
          <button
            onClick={handleSortByZinaraStart}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-800"
          >
            Sort by Zinara Start {sortAsc ? "▲" : "▼"}
          </button>
        </div>

        {/* Show form when 'showForm' is true */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="vehicleId"
                placeholder="Vehicle ID"
                required
                onChange={handleChange}
                defaultValue={editingVehicle?.vehiclereg || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="vehicleName"
                placeholder="Vehicle Name"
                required
                onChange={handleChange}
                defaultValue={editingVehicle?.vehicleName || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="ownerName"
                placeholder="Owner Name"
                required
                onChange={handleChange}
                defaultValue={editingVehicle?.ownername || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phonenumber"
                required
                placeholder="Phone No."
                onChange={handleChange}
                defaultValue={editingVehicle?.zinarastart || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="endDate"
                required
                onChange={handleChange}
                defaultValue={editingVehicle?.zinaraend || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="insurance"
                required
                onChange={handleChange}
                defaultValue={editingVehicle?.expiresIn || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Clarion">Clarion</option>
                <option value="Hamilton">Hamilton</option>
                <option value="Cell">Cell</option>
              </select>
              <input
                type="number"
                name="premium"
                placeholder="Premium"
                required
                onChange={handleChange}
                defaultValue={editingVehicle?.premium || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              {editingVehicle ? "Update" : "Submit"}
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-2 text-sm text-gray-600 uppercase text-start">
                  Vehicle ID
                </th>
                <th className="py-3 px-2 text-sm text-gray-600 uppercase text-start">
                  Owner
                </th>
                <th className="py-3 px-2 text-sm text-gray-600 uppercase text-start">
                  Insurance
                </th>
                <th className="py-3 px-2 text-sm text-gray-600 uppercase text-start">
                  Zinara End
                </th>
                <th className="py-3 px-2 text-sm text-gray-600 uppercase text-start">
                  Status
                </th>
                <th className="py-3 px-2 text-sm text-gray-600 uppercase text-start">
                  Premium
                </th>
                <th className="py-3 px-2 text-sm text-gray-600 uppercase text-start">
                  Vehicle
                </th>
                <th className="py-3 px-2 text-sm text-gray-600 uppercase text-start">
                  Phone No.
                </th>
                <th
                  className="py-3 px-2 text-sm text-gray-600 uppercase text-start cursor-pointer"
                  onClick={handleSortByZinaraStart}
                >
                  Zinara Start {sortAsc ? "▲" : "▼"}
                </th>
                <th className="py-3 px-2 text-sm text-gray-600 uppercase text-start">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 border-t border-gray-200"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700 uppercase">
                      {item.vehiclereg}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.ownername}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.insurance}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.zinaraend
                        ? new Date(item.zinaraend).toLocaleDateString("en-US", {
                            month: "2-digit",
                            year: "2-digit",
                          })
                        : "Invalid date"}
                    </td>

                    <td
                      className={`py-3 px-4 text-sm font-semibold ${
                        item.expiresIn === "Active"
                          ? "text-green-600"
                          : item.expiresIn === "About to Expire"
                          ? "text-amber-300"
                          : "text-red-600"
                      }`}
                    >
                      {item.expiresIn}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      ${item.premium.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.vehicleName}
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.phonenumber}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.zinarastart
                        ? new Date(item.zinarastart).toLocaleDateString(
                            "en-US",
                            {
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )
                        : "Invalid date"}
                    </td>
                    <td className="flex items-center justify-start gap-3 py-3 px-4 text-sm">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(item._id)}
                      >
                        <MdOutlineDelete size={22} />
                      </button>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => toggleForm(item)}
                      >
                        <FaEdit size={22} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsuranceTable;
