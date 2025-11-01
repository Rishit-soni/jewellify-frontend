export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  shopName: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  shopName: string;
  phone: string;
  role: string;
  createdAt: string;
}
