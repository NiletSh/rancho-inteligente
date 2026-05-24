import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, ToastComponent],
  templateUrl: './app.html'
})
export class AppComponent {
  router = inject(Router);
  
  esLogin(): boolean {
    const url = this.router.url;
    return url === '/login' || url === '/' || url === '';
  }
}