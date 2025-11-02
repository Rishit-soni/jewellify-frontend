import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Item, ItemFilters, ItemsResponse, CreateItemRequest } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly API_URL = `${environment.apiUrl}/items`;

  constructor(private http: HttpClient) { }

  getAllItems(filters: ItemFilters = {}): Observable<ItemsResponse> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<ItemsResponse>(this.API_URL, { params });
  }

  getItemById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.API_URL}/${id}`);
  }

  createItem(itemData: FormData): Observable<Item> {
    return this.http.post<Item>(this.API_URL, itemData);
  }

  updateItem(id: string, itemData: FormData): Observable<Item> {
    return this.http.put<Item>(`${this.API_URL}/${id}`, itemData);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
