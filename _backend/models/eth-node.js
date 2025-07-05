import mongoose from "mongoose";

const ethNodeSchema = new mongoose.Schema({
  node_code: { type: String, required: true, unique: true }, // as container name
  client_type: { type: Object, required: true }, // object of master data client_type geth or nethermind
  network: { type: Object, required: true }, // object of master data network mainnet, goerli, sepolia, etc
  host_ip: { type: String, required: true },
  host_user: { type: String, required: true },
  using_private_key: { type: Boolean, default: false }, // if true, using_private_key must be provided
  http_port: { type: String, required: true },
  ws_port: { type: String, required: true },
  p2p_port: { type: String, required: true },
  status: { type: String, required: true }, // running, deploying, stopped, error
  deploy_at: { type: Date, default: null },
  deploy_number: { type: String, required: true },
  created_by: { type: Object, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
}, { collection: 'eth_nodes' });

export default mongoose.model("EthNode", ethNodeSchema);