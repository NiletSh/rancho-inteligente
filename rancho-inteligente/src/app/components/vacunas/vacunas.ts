import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vacunas.html'
})
export class VacunasComponent implements OnInit {
  private apiService = inject(ApiService);

  listaVacunas: any[] = [];
  listaGanado: any[] = [];
  listaVeterinarios: any[] = [];
  cargando = true;
  guardando = false;
  mensajeError = '';
  mensajeExito = '';

  vacunaForm = this.crearFormularioVacio();
  editando = false;

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    forkJoin({
      vacunas: this.apiService.getVacunas(),
      ganado: this.apiService.getGanado(),
      veterinarios: this.apiService.getVeterinarios()
    }).subscribe({
      next: ({ vacunas, ganado, veterinarios }) => {
        this.listaVacunas = vacunas.map((vacuna: any) => this.normalizarVacuna(vacuna));
        this.listaGanado = ganado;
        this.listaVeterinarios = veterinarios;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar vacunas:', err);
        this.cargando = false;
      }
    });
  }

  guardar() {
    if (this.guardando) return;

    const vacuna = this.crearPayloadVacuna();
    const error = this.validarVacuna(vacuna);

    this.mensajeError = '';
    this.mensajeExito = '';

    if (error) {
      this.mensajeError = error;
      return;
    }

    this.guardando = true;

    if (this.editando) {
      this.apiService.actualizarVacuna(this.vacunaForm.id, vacuna).subscribe({
        next: () => {
          const actualizada = this.normalizarVacuna({
            id_vacuna: this.vacunaForm.id,
            ...vacuna,
            animal_nombre: this.obtenerNombreAnimal(vacuna.id_animal),
            veterinario_nombre: this.obtenerNombreVeterinario(vacuna.id_veterinario)
          });

          this.listaVacunas = this.listaVacunas.map((item) =>
            item.id === actualizada.id ? actualizada : item
          );
          this.editando = false;
          this.limpiar();
          this.mensajeExito = 'Vacuna actualizada correctamente.';
        },
        error: (err) => {
          console.error('Error al actualizar vacuna:', err);
          this.mensajeError = this.obtenerMensajeError(err, 'Error al actualizar la vacuna');
          this.guardando = false;
        },
        complete: () => {
          this.guardando = false;
        }
      });

      return;
    }

    this.apiService.crearVacuna(vacuna).subscribe({
      next: (result) => {
        const nueva = this.normalizarVacuna({
          id_vacuna: result.id,
          ...vacuna,
          animal_nombre: this.obtenerNombreAnimal(vacuna.id_animal),
          veterinario_nombre: this.obtenerNombreVeterinario(vacuna.id_veterinario)
        });

        this.listaVacunas = [nueva, ...this.listaVacunas];
        this.limpiar();
        this.mensajeExito = 'Vacuna guardada correctamente.';
      },
      error: (err) => {
        console.error('Error al crear vacuna:', err);
        this.mensajeError = this.obtenerMensajeError(err, 'Error al guardar la vacuna');
        this.guardando = false;
      },
      complete: () => {
        this.guardando = false;
      }
    });
  }

  editar(vacuna: any) {
    this.vacunaForm = {
      id: vacuna.id,
      vacuna: vacuna.vacuna,
      fecha: vacuna.fecha,
      proxima_dosis: vacuna.proxima_dosis,
      observaciones: vacuna.observaciones || '',
      id_animal: vacuna.id_animal,
      id_veterinario: vacuna.id_veterinario
    };
    this.editando = true;
  }

  cancelar() {
    this.editando = false;
    this.mensajeError = '';
    this.mensajeExito = '';
    this.limpiar();
  }

  eliminar(id: number) {
    if (confirm('Seguro de eliminar este registro de vacunacion?')) {
      this.apiService.eliminarVacuna(id).subscribe({
        next: () => {
          this.listaVacunas = this.listaVacunas.filter((vacuna) => vacuna.id !== id);
        },
        error: (err) => console.error('Error al eliminar vacuna:', err)
      });
    }
  }

  limpiar() {
    this.vacunaForm = this.crearFormularioVacio();
  }

  puedeGuardar(): boolean {
    return !this.guardando &&
      this.vacunaForm.vacuna.trim().length > 0 &&
      this.vacunaForm.fecha.length > 0 &&
      Number(this.vacunaForm.id_animal) > 0 &&
      Number(this.vacunaForm.id_veterinario) > 0;
  }

  private crearFormularioVacio() {
    return {
      id: 0,
      vacuna: '',
      fecha: '',
      proxima_dosis: '',
      observaciones: '',
      id_animal: 0,
      id_veterinario: 0
    };
  }

  private crearPayloadVacuna() {
    return {
      nombre_vacuna: this.vacunaForm.vacuna.trim(),
      fecha_aplicacion: this.vacunaForm.fecha,
      proxima_dosis: this.vacunaForm.proxima_dosis || null,
      observaciones: this.vacunaForm.observaciones.trim(),
      id_animal: Number(this.vacunaForm.id_animal),
      id_veterinario: Number(this.vacunaForm.id_veterinario)
    };
  }

  private validarVacuna(vacuna: any): string {
    if (!vacuna.nombre_vacuna) return 'Escribe el nombre de la vacuna.';
    if (!vacuna.fecha_aplicacion) return 'Selecciona la fecha de aplicacion.';
    if (!vacuna.id_animal) return 'Selecciona un animal.';
    if (!vacuna.id_veterinario) return 'Selecciona un veterinario.';
    return '';
  }

  private normalizarVacuna(vacuna: any) {
    return {
      id: vacuna.id_vacuna ?? vacuna.id,
      vacuna: vacuna.nombre_vacuna ?? vacuna.vacuna,
      fecha: this.formatearFechaInput(vacuna.fecha_aplicacion ?? vacuna.fecha),
      proxima_dosis: this.formatearFechaInput(vacuna.proxima_dosis),
      observaciones: vacuna.observaciones,
      id_animal: Number(vacuna.id_animal),
      id_veterinario: Number(vacuna.id_veterinario),
      animal: vacuna.animal_nombre ?? vacuna.animal,
      veterinario: vacuna.veterinario_nombre ?? vacuna.veterinario
    };
  }

  private formatearFechaInput(fecha: string | null | undefined): string {
    if (!fecha) return '';
    return String(fecha).slice(0, 10);
  }

  private obtenerNombreAnimal(id: number): string {
    return this.listaGanado.find((animal) => Number(animal.id_animal) === Number(id))?.nombre || '';
  }

  private obtenerNombreVeterinario(id: number): string {
    return this.listaVeterinarios.find((vet) => Number(vet.id_veterinario) === Number(id))?.nombre_completo || '';
  }

  private obtenerMensajeError(err: any, mensajeBase: string): string {
    if (err.status === 0) {
      return `${mensajeBase}: el backend no esta activo en localhost:3000.`;
    }

    return err.error?.error ? `${mensajeBase}: ${err.error.error}` : mensajeBase;
  }
}
