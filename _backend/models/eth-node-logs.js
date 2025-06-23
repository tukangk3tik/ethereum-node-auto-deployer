import mongoose from "mongoose";

const ethNodeLogSchema = new mongoose.Schema({
  node_id: { type: mongoose.Schema.Types.ObjectId, ref: "EthNode", required: true },
  node_code: { type: String, required: true },
  deploy_number: { type: String, required: true },
  transaction_type: { type: String, required: true }, // deploy, stop
  status: { type: String, required: true }, // success, error
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
}, { collection: 'eth_node_logs' });

export default mongoose.model("EthNodeLog", ethNodeLogSchema);
