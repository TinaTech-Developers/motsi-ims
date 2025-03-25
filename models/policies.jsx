import mongoose from "mongoose";

const policiesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  policynumber: { type: String, required: true },
  policyholder: { type: String, required: true },
  policytype: { type: String, required: true },
  expirydate: { type: String, required: true },
});

export default mongoose.models.Policies ||
  mongoose.model("Policies", policiesSchema);
