import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme'; // ← NUEVO IMPORT

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent {
  auth = inject(AuthService);
  router = inject(Router);
  theme = inject(ThemeService);
  
  get rolActual() { return this.auth.getRole(); }
  get darkMode() { return this.theme.darkMode(); }
  
  // ← NUEVO: Verificar si estamos en login
  get mostrarMenu(): boolean {
    const enLogin = this.router.url === '/login' || this.router.url === '';
    return !enLogin && this.rolActual !== null;
  }
  
  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}