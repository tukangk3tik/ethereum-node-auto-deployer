import mongoose from "mongoose";

const ethNodeSchema = new mongoose.Schema({
  node_id: { type: String, required: true},
  type: { type: String, required: true },
  network: { type: String, required: true },
  ip: { type: String, required: true },
  port: { type: String, required: true },
  status: { type: Boolean, required: true },
  deploy_at: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },  
  deleted_at: { type: Date },
});

export default mongoose.model("EthNode", ethNodeSchema);