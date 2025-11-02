import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateUserRequest {
  userName: string;
  email: string;
  password: string;
  role: 'Manager' | 'Staff';
  phone?: string;
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  phone?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(this.API_URL);
  }

  createUser(userData: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.API_URL, userData);
  }
}
