import apiRequest from "./api";
import { ListNodeResponse } from "../types/node";

export async function getNodes(page: number, perPage: number): Promise<ListNodeResponse> {
  return apiRequest<ListNodeResponse>(`/eth-node?page=${page}&perPage=${perPage}`, 'GET', undefined, true);
}