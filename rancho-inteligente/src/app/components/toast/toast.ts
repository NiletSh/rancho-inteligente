import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent {
  toastService = inject(ToastService);

  // Icono según tipo
  getIcon(tipo: string): string {
    switch(tipo) {
      case 'success': return 'fa-circle-check';
      case 'error': return 'fa-circle-xmark';
      case 'warning': return 'fa-triangle-exclamation';
      default: return 'fa-circle-info';
    }
  }

  // Color de fondo según tipo
  getColor(tipo: string): string {
    switch(tipo) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-danger';
      case 'warning': return 'bg-warning text-dark';
      default: return 'bg-info';
    }
  }
}