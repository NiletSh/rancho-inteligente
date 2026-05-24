import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inventario.html'
})
export class InventarioComponent implements OnInit {
  private apiService = inject(ApiService);
  listaInventario: any[] = [];
  itemForm = this.formVacio();
  editando = false;
  guardando = false;

  ngOnInit() { this.cargarDatos(); }

  cargarDatos() {
    this.apiService.getInventario().subscribe({
      next: (data) => this.listaInventario = data.map((i: any) => this.normalizar(i)),
      error: (err) => console.error('Error al cargar inventario:', err)
    });
  }

  guardar() {
    if (this.guardando) return;
    const payload = {
      tipo: this.itemForm.tipo.toLowerCase(),
      nombre_item: this.itemForm.nombre.trim(),
      cantidad: Number(this.itemForm.cantidad),
      unidad: this.itemForm.unidad.trim(),
      stock_minimo: Number(this.itemForm.stock_minimo)
    };
    this.guardando = true;
    const request = this.editando
      ? this.apiService.actualizarInventario(this.itemForm.id, payload)
      : this.apiService.crearInventario(payload);

    request.subscribe({
      next: (result) => {
        const item = this.normalizar({ id_inventario: this.editando ? this.itemForm.id : result.id, ...payload });
        this.listaInventario = this.editando
          ? this.listaInventario.map((i) => i.id === item.id ? item : i)
          : [item, ...this.listaInventario];
        this.editando = false;
        this.limpiar();
      },
      error: (err) => console.error('Error al guardar inventario:', err),
      complete: () => this.guardando = false
    });
  }

  editar(item: any) {
    this.itemForm = { ...item };
    this.editando = true;
  }

  cancelar() {
    this.editando = false;
    this.limpiar();
  }

  eliminar(id: number) {
    if (confirm('Seguro de eliminar este articulo?')) {
      this.apiService.eliminarInventario(id).subscribe({
        next: () => this.listaInventario = this.listaInventario.filter((i) => i.id !== id),
        error: (err) => console.error('Error al eliminar inventario:', err)
      });
    }
  }

  limpiar() {
    this.itemForm = this.formVacio();
  }

  getIcon(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'medicamento': return 'fa-pills';
      case 'alimento': return 'fa-wheat-awn';
      case 'herramienta': return 'fa-wrench';
      default: return 'fa-box';
    }
  }

  getColor(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'medicamento': return 'danger';
      case 'alimento': return 'success';
      case 'herramienta': return 'warning';
      default: return 'secondary';
    }
  }

  private formVacio() {
    return { id: 0, tipo: '', nombre: '', cantidad: 0, unidad: '', stock_minimo: 10 };
  }

  private normalizar(i: any) {
    return {
      id: i.id_inventario ?? i.id,
      tipo: i.tipo,
      nombre: i.nombre_item ?? i.nombre,
      cantidad: Number(i.cantidad ?? 0),
      unidad: i.unidad,
      stock_minimo: Number(i.stock_minimo ?? 10)
    };
  }
}
