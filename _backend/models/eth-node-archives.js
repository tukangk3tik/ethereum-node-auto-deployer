import mongoose from "mongoose";

const ethNodeArchiveSchema = new mongoose.Schema({
  node_id: { type: String, required: true },
  node_code: { type: String, required: true },
  node_detail: { type: Object, required: true },
  status: { type: String, required: true },  // deleted, archived
  execute_by: { type: Object, required: true },
  created_at: { type: Date, default: Date.now },
}, { collection: 'eth_node_archives' });

export default mongoose.model("EthNodeArchive", ethNodeArchiveSchema);
