import { SelectOption } from "./select_option";

export interface ApiResponse<T> {
  message: string;
  trace_id?: string;
  data?: T;
}

export interface SelectOptionResponse {
  data?: SelectOption[];
}