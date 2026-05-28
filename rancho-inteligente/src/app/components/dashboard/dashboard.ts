import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../services/api';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  stats: any = {
    totalAnimales: 0,
    totalVeterinarios: 0,
    totalVacunas: 0,
    totalInventario: 0,
    ultimosAnimales: []
  };

  proximasVacunas: any[] = [];
  cargando = true;
  errorCarga = '';

  barChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: 'Vacunas Aplicadas',
      backgroundColor: '#2d5016',
      borderColor: '#1a3009',
      borderWidth: 1
    }]
  };

  donutChartData = {
    labels: ['Sin datos'],
    datasets: [{
      data: [1],
      backgroundColor: ['#666666'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.cargando = true;
    this.errorCarga = '';

    forkJoin({
      ganado: this.apiService.getGanado().pipe(catchError((err) => this.manejarErrorApi(err))),
      vacunas: this.apiService.getVacunas().pipe(catchError((err) => this.manejarErrorApi(err))),
      veterinarios: this.apiService.getVeterinarios().pipe(catchError((err) => this.manejarErrorApi(err))),
      inventario: this.apiService.getInventario().pipe(catchError((err) => this.manejarErrorApi(err)))
    }).subscribe(({ ganado, vacunas, veterinarios, inventario }) => {
      const animales = ganado.map((animal: any) => this.normalizarAnimal(animal));

      this.stats = {
        totalAnimales: animales.length,
        totalVeterinarios: veterinarios.length,
        totalVacunas: vacunas.length,
        totalInventario: inventario.length,
        ultimosAnimales: [...animales].reverse().slice(0, 5)
      };

      this.actualizarGraficaGanado(animales);
      this.actualizarGraficaVacunas(vacunas);
      this.proximasVacunas = this.obtenerProximasVacunas(vacunas);
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }

  diasHasta(fecha: string): number {
    const hoy = new Date();
    const target = new Date(fecha);
    const diff = target.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  textoEstadoVacuna(fecha: string): string {
    const dias = this.diasHasta(fecha);

    if (dias < 0) return `Vencida hace ${Math.abs(dias)} dias`;
    if (dias === 0) return 'Hoy';
    return `${dias} dias`;
  }

  esVacunaVencida(fecha: string): boolean {
    return this.diasHasta(fecha) < 0;
  }

  esVacunaUrgente(fecha: string): boolean {
    const dias = this.diasHasta(fecha);
    return dias >= 0 && dias <= 7;
  }

  esVacunaProxima(fecha: string): boolean {
    const dias = this.diasHasta(fecha);
    return dias > 7 && dias <= 30;
  }

  esVacunaProgramada(fecha: string): boolean {
    return this.diasHasta(fecha) > 30;
  }

  private actualizarGraficaGanado(animales: any[]) {
    const especies: Record<string, number> = {};

    animales.forEach((animal) => {
      const especie = animal.especie || 'Sin especie';
      especies[especie] = (especies[especie] || 0) + 1;
    });

    const labels = Object.keys(especies);
    const data = Object.values(especies);

    this.donutChartData = {
      labels: labels.length ? labels : ['Sin datos'],
      datasets: [{
        data: data.length ? data : [1],
        backgroundColor: ['#2d5016', '#8b4513', '#daa520', '#666666', '#0d6efd'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  }

  private actualizarGraficaVacunas(vacunas: any[]) {
    const vacunasPorMes = new Array(12).fill(0);

    vacunas.forEach((vacuna: any) => {
      const fecha = new Date(vacuna.fecha || vacuna.fecha_aplicacion);
      if (!Number.isNaN(fecha.getTime())) {
        vacunasPorMes[fecha.getMonth()]++;
      }
    });

    this.barChartData = {
      ...this.barChartData,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: vacunasPorMes
      }]
    };
  }

  private obtenerProximasVacunas(vacunas: any[]) {
    return vacunas
      .map((vacuna: any) => ({
        id: vacuna.id_vacuna ?? vacuna.id,
        vacuna: vacuna.nombre_vacuna ?? vacuna.vacuna,
        animal: vacuna.animal_nombre ?? vacuna.animal,
        veterinario: vacuna.veterinario_nombre ?? vacuna.veterinario,
        proxima_dosis: vacuna.proxima_dosis
      }))
      .filter((vacuna: any) => {
        if (!vacuna.proxima_dosis) return false;
        const fechaProxima = new Date(vacuna.proxima_dosis);
        return !Number.isNaN(fechaProxima.getTime());
      })
      .sort((a: any, b: any) => {
        const diasA = this.diasHasta(a.proxima_dosis);
        const diasB = this.diasHasta(b.proxima_dosis);
        const prioridadA = diasA < 0 ? 0 : 1;
        const prioridadB = diasB < 0 ? 0 : 1;

        return prioridadA - prioridadB || Math.abs(diasA) - Math.abs(diasB);
      })
      .slice(0, 5);
  }

  private normalizarAnimal(animal: any) {
    return {
      id: animal.id_animal ?? animal.id,
      nombre: animal.nombre,
      especie: animal.especie,
      raza: animal.raza,
      edad: Number(animal.edad),
      peso: Number(animal.peso_kg ?? animal.peso ?? 0),
      foto: animal.foto_url || animal.foto || 'https://placehold.co/400x200?text=Sin+Foto'
    };
  }

  private manejarErrorApi(err: any) {
    console.error('Error al cargar dashboard:', err);
    this.errorCarga = err.status === 0
      ? 'No se pudo conectar con el backend. Revisa que el servidor esté activo.'
      : 'No se pudieron cargar todos los datos del dashboard.';

    return of([]);
  }
}
