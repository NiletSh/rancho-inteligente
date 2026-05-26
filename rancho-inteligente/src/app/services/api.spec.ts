import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Asegúrate de que esté SIN la barra al final
  private baseUrl = 'https://rancho-inteligente.onrender.com/api'; 

  constructor(private http: HttpClient) { }

  // ========== GANADO ==========
  getGanado() {
    return this.http.get(`${this.baseUrl}/ganado`);
  }

  // ========== VETERINARIOS ==========
  getVeterinarios() {
    return this.http.get(`${this.baseUrl}/veterinarios`);
  }

  // ========== VACUNAS ==========
  getVacunas() {
    return this.http.get(`${this.baseUrl}/vacunas`);
  }

  // ========== INVENTARIO ==========
  getInventario() {
    return this.http.get(`${this.baseUrl}/inventario`);
  }

  // ========== ALIMENTACION ==========
  getAlimentacion() {
    return this.http.get(`${this.baseUrl}/alimentacion`);
  }

  // ========== RANCHEROS ==========
  getRancheros() {
    return this.http.get(`${this.baseUrl}/rancheros`);
  }
}