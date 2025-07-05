import apiRequest from "./api";
import { ListNodeResponse, Node } from "../types/node";
import { ApiResponse } from "../types/global_response";

export async function getNodes(page: number, perPage: number): Promise<ListNodeResponse> {
  return await apiRequest<ListNodeResponse>(`/eth-node?page=${page}&limit=${perPage}`, 'GET', undefined, true);
}

export async function createNode(data: FormData): Promise<ApiResponse<Node>> {
  return await apiRequest<ApiResponse<Node>>(`/eth-node`, 'POST', data, true, undefined, true);
}