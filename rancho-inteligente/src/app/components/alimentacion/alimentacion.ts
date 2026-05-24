import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-alimentacion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './alimentacion.html'
})
export class AlimentacionComponent implements OnInit {
  private apiService = inject(ApiService);

  listaAlimentacion: any[] = [];
  listaGanado: any[] = [];
  aliForm = this.formVacio();
  editando = false;
  cargando = true;
  guardando = false;

  ngOnInit() { this.cargarDatos(); }

  cargarDatos() {
    this.cargando = true;
    forkJoin({
      alimentacion: this.apiService.getAlimentacion(),
      ganado: this.apiService.getGanado()
    }).subscribe({
      next: ({ alimentacion, ganado }) => {
        this.listaAlimentacion = alimentacion.map((a: any) => this.normalizar(a));
        this.listaGanado = ganado;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar alimentacion:', err);
        this.cargando = false;
      }
    });
  }

  guardar() {
    if (this.guardando) return;
    const payload = {
      tipo_alimento: this.aliForm.tipoAlimento.trim(),
      cantidad_kg: Number(this.aliForm.cantidad),
      horario: this.aliForm.horario,
      id_animal: Number(this.aliForm.id_animal)
    };
    this.guardando = true;

    const request = this.editando
      ? this.apiService.actualizarAlimentacion(this.aliForm.id, payload)
      : this.apiService.crearAlimentacion(payload);

    request.subscribe({
      next: (result) => {
        const item = this.normalizar({
          id_alimentacion: this.editando ? this.aliForm.id : result.id,
          ...payload,
          animal_nombre: this.nombreAnimal(payload.id_animal)
        });
        this.listaAlimentacion = this.editando
          ? this.listaAlimentacion.map((a) => a.id === item.id ? item : a)
          : [item, ...this.listaAlimentacion];
        this.editando = false;
        this.limpiar();
      },
      error: (err) => console.error('Error al guardar alimentacion:', err),
      complete: () => this.guardando = false
    });
  }

  editar(a: any) {
    this.aliForm = { ...a };
    this.editando = true;
  }

  cancelar() {
    this.editando = false;
    this.limpiar();
  }

  eliminar(id: number) {
    if (confirm('Seguro de eliminar este registro?')) {
      this.apiService.eliminarAlimentacion(id).subscribe({
        next: () => this.listaAlimentacion = this.listaAlimentacion.filter((a) => a.id !== id),
        error: (err) => console.error('Error al eliminar alimentacion:', err)
      });
    }
  }

  limpiar() {
    this.aliForm = this.formVacio();
  }

  private formVacio() {
    return { id: 0, tipoAlimento: '', cantidad: 0, horario: '', animal: '', id_animal: 0 };
  }

  private normalizar(a: any) {
    return {
      id: a.id_alimentacion ?? a.id,
      tipoAlimento: a.tipo_alimento ?? a.tipoAlimento,
      cantidad: Number(a.cantidad_kg ?? a.cantidad ?? 0),
      horario: String(a.horario ?? '').slice(0, 5),
      animal: a.animal_nombre ?? a.animal,
      id_animal: Number(a.id_animal)
    };
  }

  private nombreAnimal(id: number) {
    return this.listaGanado.find((g) => Number(g.id_animal) === Number(id))?.nombre || '';
  }
}
