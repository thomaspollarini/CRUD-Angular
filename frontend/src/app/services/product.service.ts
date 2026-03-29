import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductFormData } from '../models/product.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  baseUrl = 'http://localhost:3001/products';
  
  private productsSignal = signal<Product[]>([]);
  products = this.productsSignal.asReadonly();

  constructor(private http: HttpClient) {}

  loadProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      tap((products) => this.productsSignal.set(products))
    );
  }

   createProduct(formData: ProductFormData): Observable<Product> {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.http.post<Product>(this.baseUrl, newProduct).pipe(
      tap((created) => this.productsSignal.update((products) => [...products, created]))
    );
   }

  updateProduct(id: string, formData: ProductFormData): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, formData).pipe(
      tap((updated) => {
        this.productsSignal.update((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        );
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.productsSignal.update((prev) => prev.filter((p) => p.id !== id));
      })
    );
  }
}