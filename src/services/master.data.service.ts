import { SelectOptionResponse } from "../types/global_response";
import apiRequest from "./api";

export async function getNetworkOptions(): Promise<SelectOptionResponse> {
  return await apiRequest<SelectOptionResponse>(`/master/network`, 'GET', undefined, true);
}

export async function getClientTypeOptions(): Promise<SelectOptionResponse> {
  return await apiRequest<SelectOptionResponse>(`/master/client-type`, 'GET', undefined, true);
}
