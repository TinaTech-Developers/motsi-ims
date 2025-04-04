import mongoose from "mongoose";

const vehicleDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  vehiclereg: { type: String, required: true },
  ownername: { type: String, required: true },
  zinarastart: { type: Date, required: true }, // Use Date instead of String
  zinaraend: { type: Date, required: true }, // Use Date instead of String
  phonenumber: { type: String, required: true },
  premium: { type: Number, required: true },
  insurance: { type: String, required: true },
});

const vehicleData =
  mongoose.models.VehicleData ||
  mongoose.model("VehicleData", vehicleDataSchema);

export default vehicleData;
