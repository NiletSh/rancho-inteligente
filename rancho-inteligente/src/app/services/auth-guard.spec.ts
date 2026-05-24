import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(usuario: string, contrasena: string): boolean {
    let rol = '';

    // Usuarios del Rancho Inteligente
    if (usuario === 'admin' && contrasena === 'admin') rol = 'ADMIN';
    else if (usuario === 'veterinario' && contrasena === '123') rol = 'VETERINARIO';
    else if (usuario === 'empleado' && contrasena === '123') rol = 'EMPLEADO';

    if (rol) {
      // Creamos JWT falso
      const payload = btoa(JSON.stringify({ role: rol, user: usuario }));
      const fakeJwt = `header.${payload}.signature`;
      localStorage.setItem('token', fakeJwt);
      return true;
    }
    return false;
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role;
    } catch (e) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getRole() !== null;
  }

  logout() {
    localStorage.removeItem('token');
  }
}