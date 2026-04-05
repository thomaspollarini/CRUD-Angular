import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, ClientFormData } from '../models/client.model';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  baseUrl = 'http://localhost:3001/clients';

  private clientsSignal = signal<Client[]>([]);
  clients = this.clientsSignal.asReadonly();

  constructor(private http: HttpClient) {}

  loadProducts(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl).pipe(
      tap((clients) => this.clientsSignal.set(clients))
    )
  }

  createClient(formData: ClientFormData): Observable<Client> {
    const newClient: Client ={
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return this.http.post<Client>(this.baseUrl, newClient).pipe(
      tap((created) => this.clientsSignal.update((clients) => [...clients, created]))
    );
  }

  updateClient(id: string, formData: ClientFormData): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, formData).pipe(
      tap((updated) => this.clientsSignal.update((prev) => prev.map((p) => (p.id == id ? updated : p))))
    )
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.clientsSignal.update((prev) => prev.filter((p) => p.id !== id));
      })
    );
  }
}
