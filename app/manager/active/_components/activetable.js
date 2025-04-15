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

const ActiveTable = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleId: "",
    ownerName: "",
    endDate: "",
    premium: "",
    phonenumber: "",
    insurance: "",
  });
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setData([]);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();

        const updatedData = jsonData.data.map((item) => ({
          ...item,
          expiresIn: calculateStatus(item.zinaraend),
        }));

        const aboutToExpireData = updatedData.filter(
          (item) => item.expiresIn === "Active"
        );

        setData(aboutToExpireData);
      } catch (error) {
        console.error("Fetch Error", error);
        alert("Failed to fetch insurance data");
      }
    };
    fetchData();
  }, [userId]);

  const handleSubmit = async () => {
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const newData = {
      vehiclereg: formData.vehicleId.trim(),
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
      setData([...data, result.data]);
      setShowForm(false);
    } catch (error) {
      console.error("Submit Error:", error);
      alert(`Failed to submit insurance data: ${error.message}`);
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      const response = await fetch(`/api/data?id=${vehicleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to delete vehicle");
        return;
      }

      setData((prevData) =>
        prevData.filter((vehicle) => vehicle._id !== vehicleId)
      );
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      setError("Error deleting vehicle");
    }
  };

  const toggleForm = (vehicle = null) => {
    setEditingVehicle(vehicle);
    setShowForm((prevState) => !prevState);
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
          const data = await response.json();
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
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {error && (
          <div className="text-red-600 bg-red-100 p-4 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Active Insurances
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

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Vehicle ID"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 w-full md:w-1/4"
          />
        </div>

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
                defaultValue={editingVehicle?.phonenumber || ""}
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
              <input
                type="number"
                name="premium"
                placeholder="Premium"
                required
                onChange={handleChange}
                defaultValue={editingVehicle?.premium || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="insurance"
                placeholder="Insurance Provider"
                required
                onChange={handleChange}
                defaultValue={editingVehicle?.insurance || ""}
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
            >
              {editingVehicle ? "Update Record" : "Add Record"}
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Vehicle ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Owner Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Insurance
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Premium
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Phone No.
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((vehicle) => (
                <tr key={vehicle._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700 uppercase">
                    {vehicle.vehiclereg}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {vehicle.ownername}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {vehicle.insurance}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {vehicle.zinaraend
                      ? new Date(vehicle.zinaraend).toLocaleDateString(
                          "en-US",
                          {
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )
                      : "Invalid date"}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-800">
                    {vehicle.expiresIn}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${vehicle.premium.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {vehicle.phonenumber}
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      onClick={() => toggleForm(vehicle)}
                      className="text-blue-600 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <MdOutlineDelete />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveTable;
