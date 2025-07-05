export interface LoginResponse {
  data: {
    token: string;
    expiresIn: string;
    userId: number;
  };
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  expiresIn: string | null;
}
