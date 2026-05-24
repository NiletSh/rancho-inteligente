import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-ganado',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ganado.html',
  styleUrls: ['./ganado.css']
})
export class GanadoComponent implements OnInit {
  private apiService = inject(ApiService);
  private toast = inject(ToastService);

  listaGanado: any[] = [];
  listaGanadoFiltrada: any[] = [];
  textoBusqueda = '';
  cargando = true;
  guardando = false;

  animalForm = this.crearFormularioVacio();
  editando = false;

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    this.apiService.getGanado().subscribe({
      next: (data) => {
        this.listaGanado = data.map((item: any) => this.normalizarAnimal(item));
        this.filtrar();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar ganado:', err);
        this.toast.mostrar('Error al cargar datos de la API', 'error');
        this.cargando = false;
      }
    });
  }

  filtrar() {
    const texto = this.textoBusqueda.toLowerCase().trim();

    if (!texto) {
      this.listaGanadoFiltrada = [...this.listaGanado];
      return;
    }

    this.listaGanadoFiltrada = this.listaGanado.filter((animal) =>
      animal.nombre?.toLowerCase().includes(texto) ||
      animal.especie?.toLowerCase().includes(texto) ||
      animal.raza?.toLowerCase().includes(texto)
    );
  }

  guardar() {
    if (this.guardando) return;

    const animal = this.crearPayloadAnimal();
    this.guardando = true;

    if (this.editando) {
      this.apiService.actualizarAnimal(this.animalForm.id, animal).subscribe({
        next: () => {
          const actualizado = this.normalizarAnimal({ id_animal: this.animalForm.id, ...animal });
          this.listaGanado = this.listaGanado.map((item) =>
            item.id_animal === actualizado.id_animal ? actualizado : item
          );
          this.filtrar();
          this.toast.mostrar('Animal actualizado en la base de datos', 'success');
          this.editando = false;
          this.limpiarFormulario();
        },
        error: (err) => {
          console.error('Error al actualizar animal:', err);
          this.toast.mostrar(this.obtenerMensajeError(err, 'Error al actualizar'), 'error');
          this.guardando = false;
        },
        complete: () => {
          this.guardando = false;
        }
      });

      return;
    }

    this.apiService.crearAnimal(animal).subscribe({
      next: () => {
        this.toast.mostrar('Animal agregado a la base de datos', 'success');
        this.limpiarFormulario();
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al crear animal:', err);
        this.toast.mostrar(this.obtenerMensajeError(err, 'Error al crear'), 'error');
        this.guardando = false;
      },
      complete: () => {
        this.guardando = false;
      }
    });
  }

  editar(animal: any) {
    this.animalForm = {
      id: animal.id_animal,
      nombre: animal.nombre,
      especie: animal.especie,
      raza: animal.raza,
      edad: animal.edad,
      peso: animal.peso_kg,
      foto: animal.foto_url,
      estado: animal.estado || 'activo',
      id_ranchero: animal.id_ranchero || 1
    };
    this.editando = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.editando = false;
    this.limpiarFormulario();
  }

  eliminar(id: number) {
    if (confirm('Seguro de eliminar este animal?')) {
      this.apiService.eliminarAnimal(id).subscribe({
        next: () => {
          this.toast.mostrar('Animal eliminado de la base de datos', 'warning');
          this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al eliminar animal:', err);
        this.toast.mostrar(this.obtenerMensajeError(err, 'Error al eliminar'), 'error');
      }
    });
    }
  }

  limpiarFormulario() {
    this.animalForm = this.crearFormularioVacio();
  }

  private crearFormularioVacio() {
    return {
      id: 0,
      nombre: '',
      especie: '',
      raza: '',
      edad: 0,
      peso: 0,
      foto: '',
      estado: 'activo',
      id_ranchero: 1
    };
  }

  private crearPayloadAnimal() {
    return {
      nombre: this.animalForm.nombre.trim(),
      especie: this.animalForm.especie.trim(),
      raza: this.animalForm.raza.trim(),
      edad: Number(this.animalForm.edad),
      peso_kg: Number(this.animalForm.peso),
      foto_url: this.animalForm.foto.trim(),
      estado: this.animalForm.estado || 'activo',
      id_ranchero: Number(this.animalForm.id_ranchero) || 1
    };
  }

  private normalizarAnimal(item: any) {
    return {
      id_animal: item.id_animal ?? item.id,
      nombre: item.nombre,
      especie: item.especie,
      raza: item.raza,
      edad: Number(item.edad),
      peso_kg: Number(item.peso_kg ?? item.peso ?? 0),
      foto_url: item.foto_url || item.foto || 'https://placehold.co/400x200?text=Sin+Foto',
      estado: item.estado,
      id_ranchero: item.id_ranchero
    };
  }

  private obtenerMensajeError(err: any, mensajeBase: string): string {
    if (err.status === 0) {
      return `${mensajeBase}: el backend no esta activo en localhost:3000`;
    }

    return err.error?.error ? `${mensajeBase}: ${err.error.error}` : mensajeBase;
  }
}
