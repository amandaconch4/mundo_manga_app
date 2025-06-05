import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})

export class LoginPage {

  username: string = '';
  password: string = '';

  constructor(private router: Router, private alertController: AlertController) { }

  // Método que muestra alerta de error
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método para validar formato de username
  validarUsername(username: string): boolean {
    // Permite letras mayúsculas, minúsculas y números, entre 3 y 8 caracteres
    const regex = /^[a-zA-Z0-9]{3,8}$/;
    return regex.test(username);
  }

  // Método para validar formato de password
  validarPassword(password: string): boolean {
    const regex = /^\d{4}$/; // 4 dígitos numéricos
    return regex.test(password);
  }

  login() {
    // Elimina espacios en blanco
    this.username = this.username.trim();
    this.password = this.password.trim();

    // Verifica que el campo username no esté vacío
    if (!this.username) {
      this.mostrarAlerta('El campo nombre de usuario no puede estar vacío');
      return;
    }

    // Valida que el campo username tenga un formato válido
    if (!this.validarUsername(this.username)) {
      this.mostrarAlerta('El nombre de usuario debe tener entre 3 y 8 caracteres alfanuméricos');
      return;
    }

    // Verifica que el campo password no esté vacío
    if (!this.password) {
      this.mostrarAlerta('El campo contraseña no puede estar vacío');
      return;
    }

    // Valida que el campo password tenga un formato válido
    if (!this.validarPassword(this.password)) {
      this.mostrarAlerta('La contraseña debe tener 4 números');
      return;
    }

    // Si las validaciones pasan, redirige al usuario a la página de inicio
    this.router.navigate(['/home'], {state: { username: this.username }});
  }
}
