import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  // Cambia esta URL si tu backend está en otra dirección durante el desarrollo.

  // ========== GANADO ==========
  getGanado(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ganado`);
  }

  getAnimal(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ganado/${id}`);
  }

  crearAnimal(animal: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ganado`, animal);
  }

  actualizarAnimal(id: number, animal: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/ganado/${id}`, animal);
  }

  eliminarAnimal(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/ganado/${id}`);
  }

  // ========== VACUNAS ==========
  getVacunas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/vacunas`);
  }

  crearVacuna(vacuna: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/vacunas`, vacuna);
  }

  actualizarVacuna(id: number, vacuna: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/vacunas/${id}`, vacuna);
  }

  eliminarVacuna(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/vacunas/${id}`);
  }

  // ========== VETERINARIOS ==========
  getVeterinarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/veterinarios`);
  }

  crearVeterinario(veterinario: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/veterinarios`, veterinario);
  }

  actualizarVeterinario(id: number, veterinario: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/veterinarios/${id}`, veterinario);
  }

  eliminarVeterinario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/veterinarios/${id}`);
  }

  // ========== INVENTARIO ==========
  getInventario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventario`);
  }

  crearInventario(item: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/inventario`, item);
  }

  actualizarInventario(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/inventario/${id}`, item);
  }

  eliminarInventario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/inventario/${id}`);
  }

  // ========== ALIMENTACION ==========
  getAlimentacion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/alimentacion`);
  }

  crearAlimentacion(registro: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/alimentacion`, registro);
  }

  actualizarAlimentacion(id: number, registro: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/alimentacion/${id}`, registro);
  }

  eliminarAlimentacion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/alimentacion/${id}`);
  }

  // ========== RANCHEROS ==========
  getRancheros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rancheros`);
  }

  crearRanchero(ranchero: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/rancheros`, ranchero);
  }

  actualizarRanchero(id: number, ranchero: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/rancheros/${id}`, ranchero);
  }

  eliminarRanchero(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/rancheros/${id}`);
  }
}
