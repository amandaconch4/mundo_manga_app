import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private menu: MenuController,
    private router: Router
  ) {}

  // Método para que se cierre el menú al hacer clic en una opción
  closeMenu() {
    this.menu.close();
  }

  // Método para cerrar sesión
  cerrarSesion() {
    this.menu.close();
    this.router.navigate(['/login']);
  }
}
