import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer, CustomerFormData } from '../models/customer.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  baseUrl = 'http://localhost:3001/customers';

  private customersSignal = signal<Customer[]>([]);
  customers = this.customersSignal.asReadonly();

  constructor(private http: HttpClient) {}

  loadCustomers(): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(this.baseUrl)
      .pipe(tap((customers) => this.customersSignal.set(customers)));
  }

  createCustomer(formData: CustomerFormData): Observable<Customer> {
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.http
      .post<Customer>(this.baseUrl, newCustomer)
      .pipe(tap((created) => this.customersSignal.update((customers) => [...customers, created])));
  }

  updateCustomer(id: string, formData: CustomerFormData): Observable<Customer> {
    return this.http
      .put<Customer>(`${this.baseUrl}/${id}`, formData)
      .pipe(
        tap((updated) =>
          this.customersSignal.update((prev) => prev.map((p) => (p.id == id ? updated : p))),
        ),
      );
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.customersSignal.update((prev) => prev.filter((p) => p.id !== id));
      }),
    );
  }
}
