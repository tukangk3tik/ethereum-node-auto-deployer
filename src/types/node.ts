import { MetaData } from "./pagination";

export interface Node {
  _id: string;
  node_id: string;
  type: string;
  network: string;
  is_testnet: boolean;
  ip_address: string;
  rpc_port: string;
  status: boolean;
  is_deploying: boolean;
  uptime: string;
}

export interface ListNodeResponse {
  data: Node[];
  meta_data: MetaData;
}