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
  Grid,
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
    insurance: "",
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
        const updatedData = jsonData.data.map((item) => ({
          ...item,
          expiresIn: calculateStatus(item.zinaraend),
        }));

        setData(updatedData);
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Failed to fetch insurance data.");
      }
    };

    fetchData();
  }, [userId]);

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
      setData([...data, result.data]); // Add new entry to state
      handleClose();
    } catch (error) {
      console.error("Submit Error:", error);
      alert(`Failed to submit insurance data: ${error.message}`);
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
          <Typography color="error" sx={{ mt: 3 }}>
            Please log in to view your insurance data.
          </Typography>
        ) : data.length === 0 ? (
          <Typography sx={{ mt: 3 }}>No insurance data found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Vehicle ID",
                  "Owner Name",
                  "End Date",
                  "Status",
                  "Premium",
                  "Phone Number",
                  "Insurance Type",
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
                  <TableCell className="uppercase">
                    {" "}
                    {item.vehiclereg}
                  </TableCell>
                  <TableCell>{item.ownername}</TableCell>
                  <TableCell>
                    {item.zinaraend
                      ? new Date(item.zinaraend).toLocaleDateString("en-US", {
                          month: "2-digit",
                          year: "2-digit",
                        })
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
                  <TableCell className="uppercase">{item.insurance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 500, padding: 3, color: "#003366" }}>
          <Typography variant="h6" gutterBottom>
            Add Insurance
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Vehicle ID"
                name="vehicleId"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Owner Name"
                name="ownerName"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phonenumber"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="End Date"
                type="date"
                name="endDate"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Premium"
                name="premium"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Insurance Type"
                name="insurance"
                fullWidth
                onChange={handleChange}
                SelectProps={{ native: true }}
              >
                <option value="">Select</option>
                <option value="Clarion">Clarion</option>
                <option value="Hamilton">Hamilton</option>
                <option value="Cell Insurance">Cell Insurance</option>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default InsuranceTable;
