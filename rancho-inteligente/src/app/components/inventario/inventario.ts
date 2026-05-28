import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  descargarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(45, 80, 22);
    doc.text('Rancho Inteligente', 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Reporte de Inventario - ' + new Date().toLocaleDateString(), 14, 28);

    const datos = this.listaInventario.map((item: any) => [
      item.id,
      item.tipo,
      item.nombre,
      item.cantidad + ' ' + item.unidad
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Tipo', 'Nombre', 'Cantidad']],
      body: datos,
      theme: 'grid',
      headStyles: { fillColor: [45, 80, 22], textColor: [255, 255, 255] }
    });

    doc.save('Inventario_Rancho_Inteligente.pdf');
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
        this.editando = false;
        this.limpiar();
        this.cargarDatos();
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
