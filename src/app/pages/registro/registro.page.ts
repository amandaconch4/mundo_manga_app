import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})

export class RegistroPage {
  user: string = '';
  nombre: string = '';
  correo: string = '';
  password: string = '';
  nivelEducacional: string = '';
  fechaNacimiento: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private formatearFechaPipe: FormatearFechaPipe
  ) { }

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

  // Método para validar formato de correo
  validarCorreo(correo: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
  }

  // Método para validar nombre completo
  validarNombre(nombre: string): boolean {
    // Permite letras, espacios y acentos, mínimo 2 palabras
    const regex = /^[a-zA-ZÀ-ÿ\s]{2,}(?:\s[a-zA-ZÀ-ÿ\s]{2,})+$/;
    return regex.test(nombre);
  }

  // Método para validar fecha de nacimiento
  validarFechaNacimiento(fecha: string): boolean {
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    // Verificar si la fecha es futura
    if (fechaNac > hoy) {
      return false;
    }

    // Verificar edad mínima (13 años)
    if (edad < 13 || (edad === 13 && mes < 0)) {
      return false;
    }

    // Verificar edad máxima (100 años)
    if (edad > 100) {
      return false;
    }

    return true;
  }

  limpiarFormulario() {
    this.user = '';
    this.nombre = '';
    this.correo = '';
    this.password = '';
    this.nivelEducacional = '';
    this.fechaNacimiento = '';
  }

  async registrar() {
    // Eliminar espacios en blanco
    this.user = this.user.trim();
    this.nombre = this.nombre.trim();
    this.correo = this.correo.trim();
    this.password = this.password.trim();

    // Validar nombre de usuario
    if (!this.user) {
      await this.mostrarAlerta('El nombre de usuario no puede estar vacío.');
      return;
    }
    if (!this.validarUsername(this.user)) {
      await this.mostrarAlerta('El nombre de usuario debe tener entre 3 y 8 caracteres alfanuméricos.');
      return;
    }

    // Validar nombre completo
    if (!this.nombre) {
      await this.mostrarAlerta('El nombre completo no puede estar vacío.');
      return;
    }
    if (!this.validarNombre(this.nombre)) {
      await this.mostrarAlerta('El nombre completo debe contener al menos dos palabras y solo letras.');
      return;
    }

    // Validar correo
    if (!this.correo) {
      await this.mostrarAlerta('El correo electrónico no puede estar vacío.');
      return;
    }
    if (!this.validarCorreo(this.correo)) {
      await this.mostrarAlerta('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // Validar contraseña
    if (!this.password) {
      await this.mostrarAlerta('La contraseña no puede estar vacía.');
      return;
    }
    if (!this.validarPassword(this.password)) {
      await this.mostrarAlerta('La contraseña debe tener 4 números.');
      return;
    }

    // Validar nivel educacional
    if (!this.nivelEducacional) {
      await this.mostrarAlerta('Debes seleccionar un nivel educacional.');
      return;
    }

    // Validar fecha de nacimiento
    if (!this.fechaNacimiento) {
      await this.mostrarAlerta('Debes seleccionar una fecha de nacimiento.');
      return;
    }
    if (!this.validarFechaNacimiento(this.fechaNacimiento)) {
      const fechaNac = new Date(this.fechaNacimiento);
      const hoy = new Date();
      if (fechaNac > hoy) {
        await this.mostrarAlerta('La fecha no puede ser futura.');
      } else if (hoy.getFullYear() - fechaNac.getFullYear() < 13 || 
                (hoy.getFullYear() - fechaNac.getFullYear() === 13 && 
                 hoy.getMonth() - fechaNac.getMonth() < 0)) {
        await this.mostrarAlerta('Debes tener al menos 13 años para registrarte.');
      } else {
        await this.mostrarAlerta('Por favor, ingresa una fecha válida.');
      }
      return;
    }

    // Si todas las validaciones pasan, mostrar mensaje de éxito
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: `
        Nombre de usuario: ${this.user}
        Nombre completo: ${this.nombre}
        Correo: ${this.correo}
        Nivel Educacional: ${this.nivelEducacional}
        Fecha de Nacimiento: ${this.formatearFechaPipe.transform(this.fechaNacimiento)}
      `,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['/login']);
        }
      }]
    });

    await alert.present();
  }
}