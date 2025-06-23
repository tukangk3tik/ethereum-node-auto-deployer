import mongoose from "mongoose";

const ethClientTypeSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
}, { collection: 'eth_client_types' });

export default mongoose.model("EthClientType", ethClientTypeSchema);