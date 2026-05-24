import { Injectable, signal } from '@angular/core';

// Interface para cada toast
export interface Toast {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Lista reactiva de toasts visibles
  toasts = signal<Toast[]>([]);
  private idCounter = 0;

  // Mostrar un nuevo toast
  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning' = 'info') {
    const id = ++this.idCounter;
    const nuevoToast: Toast = { id, mensaje, tipo };
    
    this.toasts.update(t => [...t, nuevoToast]);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => this.eliminar(id), 3000);
  }

  // Eliminar un toast específico
  eliminar(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}