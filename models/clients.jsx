import mongoose from "mongoose";

const clientsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  vehicle: { type: String, required: true },
});

const Clients =
  mongoose.models.Clients || mongoose.model("Clients", clientsSchema);

export default Clients;
