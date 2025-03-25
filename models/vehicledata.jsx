import mongoose from "mongoose";
import { type } from "os";

const vehicleDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  vehiclereg: { type: String, required: true },
  ownername: { type: String, required: true },
  zinarastart: { type: String, required: true },
  zinaraend: { type: String, required: true },
  expiresIn: { type: String, required: true },
  phonenumber: { type: String, required: true },
  premium: { type: Number, required: true },
  insurance: { type: String, required: true },
});

const VehicleData =
  mongoose.models.VehicleData ||
  mongoose.model("VehicleData", vehicleDataSchema);

export default VehicleData;
