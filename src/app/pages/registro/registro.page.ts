import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';
import { DatabaseServiceService } from '../../services/database-service.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})

export class RegistroPage {
  username: string = '';
  nombre: string = '';
  email: string = '';
  password: string = '';
  nivelEducacion: string = '';
  fechaNacimiento: string = '';

  dbLista: boolean = false; // Variable para verificar si la base de datos está lista

  constructor(
    private alertController: AlertController,
    private router: Router,
    private formatearFechaPipe: FormatearFechaPipe,
    private databaseService: DatabaseServiceService
  ) { }

  ngOnInit() {
    // Se subscribe al observable de la base de datos para verificar si está lista
    this.databaseService.getDbLista().subscribe(isReady => {
      this.dbLista = isReady;
      if (isReady) {
      }
    });
  }

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
  validarCorreo(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
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
    this.username = '';
    this.nombre = '';
    this.email = '';
    this.password = '';
    this.nivelEducacion = '';
    this.fechaNacimiento = '';
  }

  async registrar() {
    // Eliminar espacios en blanco
    this.username = this.username.trim();
    this.nombre = this.nombre.trim();
    this.email = this.email.trim();
    this.password = this.password.trim();

    // Validar nombre de usuario
    if (!this.username) {
      await this.mostrarAlerta('El nombre de usuario no puede estar vacío.');
      return;
    }
    if (!this.validarUsername(this.username)) {
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
    if (!this.email) {
      await this.mostrarAlerta('El correo electrónico no puede estar vacío.');
      return;
    }
    if (!this.validarCorreo(this.email)) {
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
    if (!this.nivelEducacion) {
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

    // Si todas las validaciones pasan, guarda en la base de datos
    try {
      await this.databaseService.insertarUsuario(
        this.nombre,
        this.username,
        this.email,
        parseInt(this.password),
        this.nivelEducacion,
        this.fechaNacimiento
      );

      // Mostrar mensaje de éxito
      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: `
          Nombre de usuario: ${this.username}
          Nombre completo: ${this.nombre}
          Correo: ${this.email}
          Nivel Educacional: ${this.nivelEducacion}
          Fecha de Nacimiento: ${this.formatearFechaPipe.transform(this.fechaNacimiento)}
        `,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.limpiarFormulario();
            this.router.navigate(['/login']);
          }
        }]
      });

      await alert.present();
    } catch (error) {
      await this.mostrarAlerta('Error al registrar el usuario. Por favor, intente nuevamente.');
    }
  }
}