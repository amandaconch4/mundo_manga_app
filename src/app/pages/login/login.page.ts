import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseServiceService } from '../../services/database-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})

export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  dbLista: boolean = false;

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private databaseService: DatabaseServiceService
  ) { }

  ngOnInit() {
    // Se subscribe al observable de la base de datos para verificar si está lista
    this.databaseService.getDbLista().subscribe(isReady => {
      this.dbLista = isReady;
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

  async login() {
    // Elimina espacios en blanco
    this.username = this.username.trim();
    this.password = this.password.trim();

    // Verifica que el campo username no esté vacío
    if (!this.username) {
      await this.mostrarAlerta('El campo nombre de usuario no puede estar vacío');
      return;
    }

    // Valida que el campo username tenga un formato válido
    if (!this.validarUsername(this.username)) {
      await this.mostrarAlerta('El nombre de usuario debe tener entre 3 y 8 caracteres alfanuméricos');
      return;
    }

    // Verifica que el campo password no esté vacío
    if (!this.password) {
      await this.mostrarAlerta('El campo contraseña no puede estar vacío');
      return;
    }

    // Valida que el campo password tenga un formato válido
    if (!this.validarPassword(this.password)) {
      await this.mostrarAlerta('La contraseña debe tener 4 números');
      return;
    }

    try {
      const passwordNumero = parseInt(this.password);

      // Validar usuario en la base de datos
      const usuario = await this.databaseService.validarUsuario(this.username, passwordNumero);
      
      if (usuario === null) {
        await this.mostrarAlerta('Usuario o contraseña incorrectos');
        return;
      }

      // Si el usuario existe, se guarda en localStorage y se redirige
      localStorage.setItem('userActive', 'true');
      localStorage.setItem('username', this.username);
      this.router.navigate(['/tabs'], {state: { username: this.username }});
    } catch (error) {
      console.error('Error en login:', error);
      await this.mostrarAlerta('Error al validar el usuario. Por favor, intente nuevamente.');
    }
  }
}
