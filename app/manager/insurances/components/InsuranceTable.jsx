"use client";
import React, { useState, useEffect } from "react";
import { TiDocumentAdd } from "react-icons/ti";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: "",
    ownerName: "",
    endDate: "",
    premium: "",
    phonenumber: "",
  });
  const [userId, setUserId] = useState(null);

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
        setData(jsonData.data || []);
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Failed to fetch insurance data.");
      }
    };

    fetchData();
  }, [userId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const newData = {
      vehiclereg: formData.vehicleId,
      ownername: formData.ownerName,
      zinarastart: new Date().toISOString().split("T")[0],
      zinaraend: formData.endDate,
      expiresIn: calculateStatus(formData.endDate),
      phonenumber: formData.phonenumber,
      premium: Number(formData.premium),
    };

    // Basic client-side validation
    for (const key in newData) {
      if (!newData[key] && key !== "premium") {
        alert(`Field "${key}" is required.`);
        return;
      }
    }

    try {
      const response = await fetch(`/api/data/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (!response.ok) throw new Error("Failed to save data.");

      const result = await response.json();
      setData([...data, result.data]); // Update data state
      handleClose(); // Close modal
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Failed to submit insurance data. Check console for details.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <TableContainer component={Paper}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          bgcolor="white"
          border={1}
          borderColor="#003366"
          height="60px"
        >
          <Typography variant="h6" color="#003366" fontWeight={800}>
            All Your Insurance
          </Typography>
          <IconButton onClick={handleOpen} color="primary">
            <TiDocumentAdd size={30} />
          </IconButton>
        </Box>

        {!userId ? (
          <Typography variant="body1" color="error" sx={{ mt: 3 }}>
            Please log in to view your insurance data.
          </Typography>
        ) : data.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 3 }}>
            No insurance data found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Vehicle ID",
                  "Owner Name",
                  "Start Date",
                  "End Date",
                  "Status",
                  "Premium",
                  "Phone Number",
                ].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.vehiclereg}</TableCell>
                  <TableCell>{item.ownername}</TableCell>
                  <TableCell>{item.zinarastart}</TableCell>
                  <TableCell>
                    {item.zinaraend
                      ? new Date(item.zinaraend).toLocaleDateString("en-US")
                      : "Invalid date"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color:
                        item.expiresIn === "Active"
                          ? "green"
                          : item.expiresIn === "About to Expire"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {item.expiresIn}
                  </TableCell>
                  <TableCell>${item.premium}</TableCell>
                  <TableCell>{item.phonenumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 500, borderRadius: 2 }}>
          <Typography variant="h6" color="#003366" fontWeight={600}>
            Add Insurance
          </Typography>
          <Box component="form" noValidate>
            {[
              { label: "Vehicle ID", name: "vehicleId" },
              { label: "Owner Name", name: "ownerName" },
              { label: "Phone Number", name: "phonenumber" },
              { label: "End Date", name: "endDate" },
              { label: "Premium", name: "premium" },
            ].map(({ label, name }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                fullWidth
                margin="normal"
                onChange={handleChange}
              />
            ))}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default InsuranceTable;
