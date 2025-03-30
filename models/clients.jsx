import mongoose from "mongoose";
import { type } from "os";

const clientsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  regnumber: { type: String, required: true },
  expirydate: { type: String, required: true },
  vehicle: { type: String, required: true },
  expiresIn: { type: String, required: true },
});

const Clients =
  mongoose.models.Clients || mongoose.model("Clients", clientsSchema);

export default Clients;
