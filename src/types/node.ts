import { EthClientType } from "./eth_client_type";
import { EthNetwork } from "./eth_network";
import { MetaData } from "./pagination";

export interface Node {
  _id: string;
  node_code: string;
  client_type: EthClientType;
  network: EthNetwork;
  host_ip: string;
  host_user: string;
  http_port: string;
  ws_port: string;
  p2p_port: string;
  status: string;
  uptime: string;
}

export interface ListNodeResponse {
  data: Node[];
  meta_data: MetaData;
}

export interface CreateUpdateNodeRequest {
  // _id is optional for create requests, but required for update requests
  // If _id is provided, it indicates an update operation
  // If _id is not provided, it indicates a create operation
  // This allows the same interface to be used for both create and update operations
  // and simplifies the API design 
  _id?: string;
  
  node_code: string;
  client_type: string;
  network: string;
  host_ip: string;
  host_user: string;
  http_port: string;
  ws_port: string;
  p2p_port: string;
  auto_deploy: boolean;
}