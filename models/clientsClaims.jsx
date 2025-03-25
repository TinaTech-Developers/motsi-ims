const { default: mongoose } = require("mongoose");

const clientsClaimsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  clientname: { type: String, required: true },
  policynumber: { type: String, required: true },
  amount: { type: Number, required: true },
  details: { type: String, required: true },
  status: { type: Boolean },
  submissiondate: { type: String, required: true },
});

export default mongoose.models.ClientsClaims ||
  mongoose.model("ClientsClaims", clientsClaimsSchema);
