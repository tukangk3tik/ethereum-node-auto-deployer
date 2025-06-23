import mongoose from "mongoose";

const ethNetworkListSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
}, { collection: 'eth_network_lists' });

export default mongoose.model("EthNetworkList", ethNetworkListSchema);