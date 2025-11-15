import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    Customer,
    CustomerFilters,
    CustomersResponse,
    CreateCustomerRequest,
    CustomerDetailsResponse
} from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private readonly API_URL = `${environment.apiUrl}/customers`;

    constructor(private http: HttpClient) { }

    getAllCustomers(filters: CustomerFilters = {}): Observable<CustomersResponse> {
        let params = new HttpParams();

        if (filters.search) {
            params = params.set('search', filters.search);
        }
        if (filters.page) {
            params = params.set('page', filters.page.toString());
        }
        if (filters.limit) {
            params = params.set('limit', filters.limit.toString());
        }

        return this.http.get<CustomersResponse>(this.API_URL, { params });
    }

    getCustomerById(id: string): Observable<Customer> {
        return this.http.get<Customer>(`${this.API_URL}/${id}`);
    }

    getCustomerDetails(id: string, skipLoader = false): Observable<CustomerDetailsResponse> {
        const headers = skipLoader ? { 'X-Skip-Loading': 'true' } : undefined;
        return this.http.get<CustomerDetailsResponse>(`${this.API_URL}/${id}/details`, headers ? { headers } : {});
    }

    createCustomer(customerData: CreateCustomerRequest): Observable<Customer> {
        return this.http.post<Customer>(this.API_URL, customerData);
    }

    updateCustomer(id: string, customerData: Partial<CreateCustomerRequest>): Observable<Customer> {
        return this.http.put<Customer>(`${this.API_URL}/${id}`, customerData);
    }

    deleteCustomer(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
