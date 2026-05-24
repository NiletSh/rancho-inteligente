import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Señal reactiva para el modo oscuro
  darkMode = signal<boolean>(false);

  constructor() {
    // Leer preferencia guardada del navegador
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      this.darkMode.set(saved === 'true');
      this.applyTheme();
    }
  }

  // Cambiar entre claro y oscuro
  toggle() {
    this.darkMode.update(v => !v);
    localStorage.setItem('darkMode', this.darkMode().toString());
    this.applyTheme();
  }

  // Aplicar la clase al body
  private applyTheme() {
    if (this.darkMode()) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}