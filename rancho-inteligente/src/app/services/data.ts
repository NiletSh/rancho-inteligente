import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private ganado = [
    { id: 1, nombre: 'Lola', especie: 'Vaca', raza: 'Holstein', edad: 3, peso: 450, foto: 'https://placehold.co/400x200?text=Vaca+Lola&bg=2d5016' },
    { id: 2, nombre: 'Toro', especie: 'Toro', raza: 'Angus', edad: 5, peso: 800, foto: 'https://placehold.co/400x200?text=Toro&bg=8b4513' },
    { id: 3, nombre: 'Luna', especie: 'Yegua', raza: 'Cuarto de Milla', edad: 4, peso: 500, foto: 'https://placehold.co/400x200?text=Yegua+Luna&bg=654321' }
  ];

  getGanado() { return [...this.ganado]; }
  agregarGanado(animal: any) { animal.id = this.ganado.length + 1; this.ganado.push(animal); }
  actualizarGanado(animal: any) { const i = this.ganado.findIndex(g => g.id === animal.id); if (i !== -1) this.ganado[i] = animal; }
  eliminarGanado(id: number) { this.ganado = this.ganado.filter(g => g.id !== id); }

  private veterinarios = [
    { id: 1, nombre: 'Dr. Juan Pérez', telefono: '555-1234', especialidad: 'Bovinos', sueldo: 25000 },
    { id: 2, nombre: 'Dra. María López', telefono: '555-5678', especialidad: 'Equinos', sueldo: 28000 }
  ];

  getVeterinarios() { return [...this.veterinarios]; }
  agregarVeterinario(vet: any) { vet.id = this.veterinarios.length + 1; this.veterinarios.push(vet); }
  actualizarVeterinario(vet: any) { const i = this.veterinarios.findIndex(v => v.id === vet.id); if (i !== -1) this.veterinarios[i] = vet; }
  eliminarVeterinario(id: number) { this.veterinarios = this.veterinarios.filter(v => v.id !== id); }

  // ← MODIFICADO: Agregado campo proxima_dosis
  private vacunas = [
    { 
      id: 1, 
      vacuna: 'Vacuna Aftosa', 
      fecha: '2024-03-15', 
      proxima_dosis: '2025-06-15',  // ← NUEVO
      animal: 'Lola', 
      veterinario: 'Dr. Juan Pérez' 
    },
    { 
      id: 2, 
      vacuna: 'Desparasitante', 
      fecha: '2024-04-20', 
      proxima_dosis: '2025-05-25',  // ← NUEVO (más cercana)
      animal: 'Toro', 
      veterinario: 'Dra. María López' 
    },
    { 
      id: 3, 
      vacuna: 'Brucelosis', 
      fecha: '2024-01-10', 
      proxima_dosis: '2025-07-10',  // ← NUEVO
      animal: 'Luna', 
      veterinario: 'Dr. Juan Pérez' 
    }
  ];

  getVacunas() { return [...this.vacunas]; }
  agregarVacuna(v: any) { v.id = this.vacunas.length + 1; this.vacunas.push(v); }
  actualizarVacuna(v: any) { const i = this.vacunas.findIndex(vac => vac.id === v.id); if (i !== -1) this.vacunas[i] = v; }
  eliminarVacuna(id: number) { this.vacunas = this.vacunas.filter(v => v.id !== id); }

  private alimentacion = [
    { id: 1, tipoAlimento: 'Pasto Verde', cantidad: 10, horario: '07:00', animal: 'Lola' },
    { id: 2, tipoAlimento: 'Concentrado', cantidad: 5, horario: '14:00', animal: 'Toro' }
  ];

  getAlimentacion() { return [...this.alimentacion]; }
  agregarAlimentacion(a: any) { a.id = this.alimentacion.length + 1; this.alimentacion.push(a); }
  actualizarAlimentacion(a: any) { const i = this.alimentacion.findIndex(al => al.id === a.id); if (i !== -1) this.alimentacion[i] = a; }
  eliminarAlimentacion(id: number) { this.alimentacion = this.alimentacion.filter(a => a.id !== id); }

  private inventario = [
    { id: 1, tipo: 'Medicamento', nombre: 'Antibiótico Bovino', cantidad: 50, unidad: 'ml' },
    { id: 2, tipo: 'Alimento', nombre: 'Concentrado Premium', cantidad: 20, unidad: 'kg' },
    { id: 3, tipo: 'Herramienta', nombre: 'Jeringa 10ml', cantidad: 15, unidad: 'pzas' }
  ];

  getInventario() { return [...this.inventario]; }
  agregarInventario(item: any) { item.id = this.inventario.length + 1; this.inventario.push(item); }
  actualizarInventario(item: any) { const i = this.inventario.findIndex(it => it.id === item.id); if (i !== -1) this.inventario[i] = item; }
  eliminarInventario(id: number) { this.inventario = this.inventario.filter(i => i.id !== id); }

  private rancheros = [
    { id: 1, nombre: 'Don Ramón García', contacto: '555-9999', direccion: 'Rancho La Esperanza, Km 5' },
    { id: 2, nombre: 'Doña Carmen Ruiz', contacto: '555-7777', direccion: 'Rancho El Dorado, Km 12' }
  ];

  getRancheros() { return [...this.rancheros]; }
  agregarRanchero(r: any) { r.id = this.rancheros.length + 1; this.rancheros.push(r); }
  actualizarRanchero(r: any) { const i = this.rancheros.findIndex(ran => ran.id === r.id); if (i !== -1) this.rancheros[i] = r; }
  eliminarRanchero(id: number) { this.rancheros = this.rancheros.filter(r => r.id !== id); }

  // ← MODIFICADO: Agregado ultimosAnimales
  getStats() {
    return {
      totalAnimales: this.ganado.length,
      totalVeterinarios: this.veterinarios.length,
      totalVacunas: this.vacunas.length,
      totalInventario: this.inventario.length,
      vacunasPorMes: [12, 19, 15, 25, 22, 30, 28, 35, 20, 18, 15, 10],
      ultimosAnimales: [...this.ganado].reverse().slice(0, 5) // ← NUEVO
    };
  }
}