import { Component} from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})

export class RegistroPage {
  user: string = '';
  nombre: string = '';
  correo: string = '';
  password: string = '';
  nivelEducacional: string = '';
  fechaNacimiento: string = '';

  constructor(private alertController: AlertController) { }

  limpiarFormulario() {

    this.user = '';
    this.nombre = '';
    this.correo = '';
    this.password = '';
    this.nivelEducacional = '';
    this.fechaNacimiento = '';
  }

  async registrar() {
    if (!this.user || !this.nombre || !this.correo || !this.password || !this.nivelEducacional || !this.fechaNacimiento) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    //Si pasan todos los campos, se muestra mensaje de éxito y muestra los datos ingresados
    const alert = await this.alertController.create({
      header: 'Registro exitoso, estos son sus datos',
      message: `
        Nombre completo: ${this.nombre}
        Nivel Educacional: ${this.nivelEducacional}
        Fecha de Nacimiento: ${this.fechaNacimiento}
      `,
      buttons: ['OK']
    });

    await alert.present();
  }
}