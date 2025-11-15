import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    CategoryResponse,
    CategoriesResponse
} from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) { }

    getCategories(): Observable<CategoriesResponse> {
        return this.http.get<CategoriesResponse>(this.apiUrl);
    }

    createCategory(request: CreateCategoryRequest): Observable<CategoryResponse> {
        return this.http.post<CategoryResponse>(this.apiUrl, request);
    }

    updateCategory(id: string, request: UpdateCategoryRequest): Observable<CategoryResponse> {
        return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, request);
    }

    deleteCategory(id: string): Observable<{ success: boolean; message: string }> {
        return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
    }
}
