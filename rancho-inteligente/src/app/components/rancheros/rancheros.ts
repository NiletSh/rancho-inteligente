import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-rancheros',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rancheros.html'
})
export class RancherosComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  listaRancheros: any[] = [];
  ranchForm = this.formVacio();
  editando = false;
  guardando = false;
  cargando = true;

  ngOnInit() { this.cargarDatos(); }

  cargarDatos() {
    this.cargando = true;
    this.apiService.getRancheros().subscribe({
      next: (data) => {
        this.listaRancheros = data.map((r: any) => this.normalizar(r));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar rancheros:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardar() {
    if (this.guardando) return;
    const payload = {
      nombre_completo: this.ranchForm.nombre.trim(),
      contacto: this.ranchForm.contacto.trim(),
      direccion_rancho: this.ranchForm.direccion.trim()
    };
    this.guardando = true;
    const request = this.editando
      ? this.apiService.actualizarRanchero(this.ranchForm.id, payload)
      : this.apiService.crearRanchero(payload);

    request.subscribe({
      next: (result) => {
        this.editando = false;
        this.limpiar();
        this.cargarDatos();
      },
      error: (err) => console.error('Error al guardar ranchero:', err),
      complete: () => this.guardando = false
    });
  }

  editar(r: any) {
    this.ranchForm = { ...r };
    this.editando = true;
  }

  cancelar() {
    this.editando = false;
    this.limpiar();
  }

  eliminar(id: number) {
    if (confirm('Seguro de eliminar este ranchero?')) {
      this.apiService.eliminarRanchero(id).subscribe({
        next: () => this.listaRancheros = this.listaRancheros.filter((r) => r.id !== id),
        error: (err) => console.error('Error al eliminar ranchero:', err)
      });
    }
  }

  limpiar() {
    this.ranchForm = this.formVacio();
  }

  private formVacio() {
    return { id: 0, nombre: '', contacto: '', direccion: '' };
  }

  private normalizar(r: any) {
    return {
      id: r.id_ranchero ?? r.id,
      nombre: r.nombre_completo ?? r.nombre,
      contacto: r.contacto,
      direccion: r.direccion_rancho ?? r.direccion
    };
  }
}
