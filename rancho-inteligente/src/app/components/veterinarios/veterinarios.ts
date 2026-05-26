import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-veterinarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './veterinarios.html'
})
export class VeterinariosComponent implements OnInit {
  private apiService = inject(ApiService);
  listaVeterinarios: any[] = [];
  vetForm = this.formVacio();
  editando = false;
  guardando = false;

  ngOnInit() { this.cargarDatos(); }

  cargarDatos() {
    this.apiService.getVeterinarios().subscribe({
      next: (data) => this.listaVeterinarios = data.map((v: any) => this.normalizar(v)),
      error: (err) => console.error('Error al cargar veterinarios:', err)
    });
  }

  guardar() {
    if (this.guardando) return;
    const payload = {
      nombre_completo: this.vetForm.nombre.trim(),
      telefono: this.vetForm.telefono.trim(),
      especialidad: this.vetForm.especialidad.trim(),
      sueldo: Number(this.vetForm.sueldo)
    };
    this.guardando = true;
    const request = this.editando
      ? this.apiService.actualizarVeterinario(this.vetForm.id, payload)
      : this.apiService.crearVeterinario(payload);

    request.subscribe({
      next: (result) => {
        this.editando = false;
        this.limpiar();
        this.cargarDatos();
      },
      error: (err) => console.error('Error al guardar veterinario:', err),
      complete: () => this.guardando = false
    });
  }

  editar(vet: any) {
    this.vetForm = { ...vet };
    this.editando = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelar() {
    this.editando = false;
    this.limpiar();
  }

  eliminar(id: number) {
    if (confirm('Seguro de eliminar este veterinario?')) {
      this.apiService.eliminarVeterinario(id).subscribe({
        next: () => this.listaVeterinarios = this.listaVeterinarios.filter((v) => v.id !== id),
        error: (err) => console.error('Error al eliminar veterinario:', err)
      });
    }
  }

  limpiar() {
    this.vetForm = this.formVacio();
  }

  private formVacio() {
    return { id: 0, nombre: '', telefono: '', especialidad: '', sueldo: 0 };
  }

  private normalizar(v: any) {
    return {
      id: v.id_veterinario ?? v.id,
      nombre: v.nombre_completo ?? v.nombre,
      telefono: v.telefono,
      especialidad: v.especialidad,
      sueldo: Number(v.sueldo ?? 0)
    };
  }
}
