import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.page.html',
  styleUrls: ['./recuperar-contrasenia.page.scss'],
  standalone: false,
})

export class RecuperarContraseniaPage {
  correo: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController
  ) { }

  // Método para validar formato de correo
  validarCorreo(correo: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
  }

  // Método para mostrar alertas de error
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método para limpiar el formulario
  limpiarFormulario() {
    this.correo = '';
  }

  async enviarCorreo() {
    // Elimina espacios en blanco
    this.correo = this.correo.trim();

    // Valida que el campo no esté vacío
    if (!this.correo) {
      await this.mostrarAlerta('El campo correo electrónico no puede estar vacío.');
      return;
    }

    // Valida formato del correo
    if (!this.validarCorreo(this.correo)) {
      await this.mostrarAlerta('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // Si las validaciones pasan, muestra mensaje de éxito
    const alert = await this.alertController.create({
      header: 'Correo enviado',
      message: 'Se han enviado las instrucciones para recuperar la contraseña a tu correo electrónico.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.limpiarFormulario();
          this.router.navigate(['/login']);
        }
      }]
    });

    await alert.present();
  }
}
