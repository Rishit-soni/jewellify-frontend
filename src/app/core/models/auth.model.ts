export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager';
  businessName: string;
  ownerName: string;
  phone: string;
  address?: string;
  gstNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  tenant?: Tenant;
}

export interface User {
  id: string;
  _id?: string;
  userName: string;
  email: string;
  role: 'Admin' | 'Manager';
  tenantId: string;
  createdAt?: string;
}

export interface Tenant {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  createdAt?: string;
}
