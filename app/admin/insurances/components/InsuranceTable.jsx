import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdEdit, MdOutlineDelete } from "react-icons/md";

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
  const [showForm, setShowForm] = useState(false); // Add state to show/hide form
  const [error, setError] = useState(""); // Define the error state
  const [editingVehicle, setEditingVehicle] = useState(null); // State to store the vehicle being edited

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();
        const updatedData = jsonData.data.map((item) => ({
          ...item,
          expiresIn: calculateStatus(item.zinaraend),
        }));
        setData(jsonData.data);
      } catch (error) {
        console.error("Fetch Error", error);
        alert("Failed to fetch insurance data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateStatus = () => {
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          expiresIn: calculateStatus(item.zinaraend),
        }))
      );
    };

    updateStatus(); // Initial update
    const intervalId = setInterval(updateStatus, 86400000); // Update every 24 hours

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []); // Empty dependency array to run once on mount

  const handleDelete = async (vehicleId) => {
    try {
      const response = await fetch(`/api/data?id=${vehicleId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the deleted vehicle from the data array in state
        setData(data.filter((vehicle) => vehicle._id !== vehicleId));
      } else {
        setError(data.message || "Failed to delete vehicle");
      }
    } catch (err) {
      setError("Error deleting vehicle");
    }
  };

  const toggleForm = (vehicle = null) => {
    setEditingVehicle(vehicle); // If vehicle is passed, it's an edit action
    setShowForm((prevState) => !prevState); // Toggle showForm state
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const vehicleData = {
      vehicleId: formData.get("vehicleId"),
      ownerName: formData.get("ownerName"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      status: formData.get("status"),
      premium: formData.get("premium"),
    };

    // Validate that both 'vehicleId' and 'endDate' are present
    if (!vehicleData.vehicleId || !vehicleData.endDate) {
      setError("Vehicle ID and new 'zinaraend' value are required.");
      return;
    }

    if (editingVehicle) {
      // Handle updating the vehicle's 'zinaraend'
      try {
        const response = await fetch(`/api/data?id=${editingVehicle._id}`, {
          method: "PUT", // PUT request to update the vehicle
          body: JSON.stringify({ zinaraend: vehicleData.endDate }), // Send only the updated 'zinaraend'
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        console.log("Response Data:", data); // Add this line to see the full response

        if (response.ok) {
          // If the response data is an object (updated vehicle), update accordingly
          setData((prevData) =>
            prevData.map((item) =>
              item._id === editingVehicle._id
                ? { ...item, zinaraend: vehicleData.endDate }
                : item
            )
          );
          setShowForm(false);
          setEditingVehicle(null);
        } else {
          setError(data.message || "Failed to update vehicle");
        }
      } catch (error) {
        console.error("Error updating vehicle:", error); // Log the actual error
        setError("Error updating vehicle");
      }
    } else {
      // Handle adding a new vehicle (POST request)
      try {
        const response = await fetch("/api/data", {
          method: "POST",
          body: JSON.stringify(vehicleData),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (response.ok) {
          setData((prevData) => [...prevData, data]);
          setShowForm(false);
        } else {
          setError(data.message || "Failed to add vehicle");
        }
      } catch (error) {
        setError("Error adding vehicle");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Error Display */}
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
            onClick={() => toggleForm()} // Toggle the form visibility
            className={`px-4 py-2 rounded text-white ${
              showForm
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {showForm ? "Cancel" : "Add Record"}
          </button>
        </div>

        {/* Show form when showForm is true */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="vehicleId"
                placeholder="Vehicle ID"
                required
                defaultValue={editingVehicle?.vehiclereg || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="ownerName"
                placeholder="Owner Name"
                required
                defaultValue={editingVehicle?.ownername || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="startDate"
                required
                defaultValue={editingVehicle?.zinarastart || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="endDate"
                required
                defaultValue={editingVehicle?.zinaraend || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="status"
                required
                defaultValue={editingVehicle?.expiresIn || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
              <input
                type="number"
                name="premium"
                placeholder="Premium"
                required
                defaultValue={editingVehicle?.premium || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {editingVehicle ? "Update Record" : "Add Record"}
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-600 text-white">
              <tr>
                {[
                  "Vehicle ID",
                  "Owner Name",
                  "Insurance",
                  "End Date",
                  "Status",
                  "Premium",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="py-3 px-4 text-left text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={idx}
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
                    {item.zinaraend}
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
                  <td className="flex items-center justify-center gap-3 py-3 px-4 text-sm">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(item._id)} // Pass vehicleId here
                    >
                      <MdOutlineDelete size={22} />
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => toggleForm(item)} // Pass the vehicle data to toggle form for editing
                    >
                      <FaEdit size={22} color="blue" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsuranceTable;
