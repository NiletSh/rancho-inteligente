import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  usuario = '';
  password = '';
  error = false;
  
  auth = inject(AuthService);
  router = inject(Router);

  ingresar() {
    const valido = this.auth.login(this.usuario, this.password);
    if (valido) {
      this.error = false;
      const rol = this.auth.getRole();
      
      if (rol === 'VETERINARIO') this.router.navigate(['/vacunas']);
      else if (rol === 'EMPLEADO') this.router.navigate(['/alimentacion']);
      else this.router.navigate(['/dashboard']);
      
    } else {
      this.error = true;
    }
  }
}