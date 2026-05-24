import { Routes } from '@angular/router';
import { authGuard } from '../../src/app/services/auth-guard';

import { LoginComponent } from './components/login/login';
import { GanadoComponent } from './components/ganado/ganado';
import { VacunasComponent } from './components/vacunas/vacunas';
import { AlimentacionComponent } from './components/alimentacion/alimentacion';
import { VeterinariosComponent} from './components/veterinarios/veterinarios';
import { InventarioComponent } from './components/inventario/inventario';
import { RancherosComponent } from './components/rancheros/rancheros';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // 🔒 TODAS estas rutas están protegidas por el Guard
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'ganado', component: GanadoComponent, canActivate: [authGuard] },
  { path: 'vacunas', component: VacunasComponent, canActivate: [authGuard] },
  { path: 'alimentacion', component: AlimentacionComponent, canActivate: [authGuard] },
  { path: 'veterinarios', component: VeterinariosComponent, canActivate: [authGuard] },
  { path: 'inventario', component: InventarioComponent, canActivate: [authGuard] },
  { path: 'rancheros', component: RancherosComponent, canActivate: [authGuard] }
];