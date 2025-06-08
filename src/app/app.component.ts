import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private menu: MenuController) {}

  // Método para que se cierre el menú al hacer clic en una opción
  closeMenu() {
    this.menu.close();
  }
}
