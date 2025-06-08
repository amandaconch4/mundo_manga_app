import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})

export class PerfilPage {

  user: string = '';
  nombre: string = '';
  correo: string = '';
  password: string = '';
  nivelEducacional: string = '';
  fechaNacimiento: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private formatearFechaPipe: FormatearFechaPipe) { }

  // Método que muestra alerta
  async mostrarAlerta(header: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: header,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método para validar formato de username
  validarUsername(username: string): boolean {
    const regex = /^[a-zA-Z0-9]{3,8}$/;
    return regex.test(username);
  }

  // Método para validar formato de password
  validarPassword(password: string): boolean {
    const regex = /^\d{4}$/;
    return regex.test(password);
  }

  // Método para validar formato de correo
  validarCorreo(correo: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
  }

  // Método para validar nombre completo
  validarNombre(nombre: string): boolean {
    const regex = /^[a-zA-ZÀ-ÿ\s]{2,}(?:\s[a-zA-ZÀ-ÿ\s]{2,})+$/;
    return regex.test(nombre);
  }

  // Método para validar fecha de nacimiento
  validarFechaNacimiento(fecha: string): boolean {
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (fechaNac > hoy) {
      return false;
    }

    if (edad < 13 || (edad === 13 && mes < 0)) {
      return false;
    }

    if (edad > 100) {
      return false;
    }

    return true;
  }

  async guardarCambios() {
    // Eliminar espacios en blanco solo al inicio y final
    this.user = this.user.trim();
    this.nombre = this.nombre.trim();
    this.correo = this.correo.trim();
    this.password = this.password.trim();

    // Validaciones
    if (!this.user || !this.validarUsername(this.user)) {
      await this.mostrarAlerta('Error', 'El nombre de usuario debe tener entre 3 y 8 caracteres alfanuméricos.');
      return;
    }

    if (!this.nombre || !this.validarNombre(this.nombre)) {
      await this.mostrarAlerta('Error', 'El nombre completo debe contener al menos dos palabras y solo letras.');
      return;
    }

    if (!this.correo || !this.validarCorreo(this.correo)) {
      await this.mostrarAlerta('Error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!this.password || !this.validarPassword(this.password)) {
      await this.mostrarAlerta('Error', 'La contraseña debe tener 4 números.');
      return;
    }

    if (!this.nivelEducacional) {
      await this.mostrarAlerta('Error', 'Debes seleccionar un nivel educacional.');
      return;
    }

    if (!this.fechaNacimiento || !this.validarFechaNacimiento(this.fechaNacimiento)) {
      await this.mostrarAlerta('Error', 'Por favor, ingresa una fecha de nacimiento válida.');
      return;
    }

    // Si todas las validaciones son correctas, se guardan los cambios
    await this.mostrarAlerta('Éxito', 'Los cambios se han guardado correctamente.');
  }

  async eliminarCuenta() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar su cuenta? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}
