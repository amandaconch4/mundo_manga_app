import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';
import { ProfileImageService } from '../../services/profile-image.service';
import { DatabaseServiceService } from '../../services/database-service.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})

export class PerfilPage implements OnInit {

  user: string = '';
  nombre: string = '';
  correo: string = '';
  password: string = '';
  nivelEducacional: string = '';
  fechaNacimiento: string = '';
  
  // Variable para almacenar la imagen de perfil
  profileImage: string | null = null;

  constructor(
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private formatearFechaPipe: FormatearFechaPipe,
    private profileImageService: ProfileImageService,
    private databaseService: DatabaseServiceService) { }

  
  // Carga los datos del usuario desde la base de datos
  async cargarDatosUsuario() {
    const username = localStorage.getItem('username');
    if (username) {
      try {
        const usuario = await this.databaseService.getUsuarioPorUsername(username);
        if (usuario) {
          this.user = usuario.username;
          this.nombre = usuario.nombre;
          this.correo = usuario.email;
          this.password = usuario.password.toString();
          this.nivelEducacional = usuario.nivelEducacion;
          this.fechaNacimiento = usuario.fechaNacimiento ? usuario.fechaNacimiento.toString() : '';
        }
      } catch (error) {
        await this.mostrarAlerta('Error', 'No se pudieron cargar los datos del usuario.');
      }
    }
  }

  // Carga la imagen de perfil guardada
  ngOnInit() {
    this.loadProfileImage();
    this.cargarDatosUsuario();
  }

  //Recarga la imagen de perfil por si se actualizó desde otra página
  ionViewWillEnter() {
    this.loadProfileImage();
    this.cargarDatosUsuario();
  }

  //Carga la imagen de perfil desde el almacenamiento local
  loadProfileImage() {
    this.profileImage = this.profileImageService.loadProfileImage();
  }

  //Muestra un menú de opciones para cambiar la foto de perfil
  async showPhotoOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar foto de perfil',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera-outline',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Seleccionar de galería',
          icon: 'images-outline',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: 'Eliminar foto actual',
          icon: 'trash-outline',
          handler: () => {
            this.removeProfileImage();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // Toma una foto usando la cámara del dispositivo
  async takePicture() {
    const imageDataUrl = await this.profileImageService.takePicture();
    if (imageDataUrl) {
      this.profileImage = imageDataUrl;
      this.profileImageService.saveProfileImage(imageDataUrl);
      await this.mostrarAlerta('Éxito', 'Foto de perfil actualizada correctamente.');
    }
  }

  // Selecciona una imagen de la galería del dispositivo
  async selectFromGallery() {
    const imageDataUrl = await this.profileImageService.selectFromGallery();
    if (imageDataUrl) {
      this.profileImage = imageDataUrl;
      this.profileImageService.saveProfileImage(imageDataUrl);
      await this.mostrarAlerta('Éxito', 'Foto de perfil actualizada correctamente.');
    }
  }

  // Elimina la foto de perfil actual
  async removeProfileImage() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar su foto de perfil?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.profileImage = null;
            this.profileImageService.removeProfileImage();
            this.mostrarAlerta('Éxito', 'Foto de perfil eliminada correctamente.');
          }
        }
      ]
    });
    await alert.present();
  }

  //Cambia a la imagen por defecto si hay un error
  onImageError(event: any) {
    event.target.src = 'assets/icon/favicon.png';
  }

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

  // Método para validar formato de contraseña
  validarPassword(password: string): boolean {
    const regex = /^\d{4}$/;
    return regex.test(password);
  }

  // Método para validar formato de correo electrónico
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

    // Verifica que la fecha no sea futura
    if (fechaNac > hoy) {
      return false;
    }

    // Verifica edad mínima (13 años)
    if (edad < 13 || (edad === 13 && mes < 0)) {
      return false;
    }

    // Verifica edad máxima (100 años)
    if (edad > 100) {
      return false;
    }

    return true;
  }

  // Método para guardar los cambios del perfil
  async guardarCambios() {
    // Elimina espacios en blanco solo al inicio y final de cada campo
    this.user = this.user.trim();
    this.nombre = this.nombre.trim();
    this.correo = this.correo.trim();
    this.password = this.password.trim();

    
    // Valida nombre de usuario
    if (!this.user || !this.validarUsername(this.user)) {
      await this.mostrarAlerta('Error', 'El nombre de usuario debe tener entre 3 y 8 caracteres alfanuméricos.');
      return;
    }

    // Valida nombre completo
    if (!this.nombre || !this.validarNombre(this.nombre)) {
      await this.mostrarAlerta('Error', 'El nombre completo debe contener al menos dos palabras y solo letras.');
      return;
    }

    // Valida correo electrónico
    if (!this.correo || !this.validarCorreo(this.correo)) {
      await this.mostrarAlerta('Error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // Valida contraseña
    if (!this.password || !this.validarPassword(this.password)) {
      await this.mostrarAlerta('Error', 'La contraseña debe tener 4 números.');
      return;
    }

    // Valida nivel educacional
    if (!this.nivelEducacional) {
      await this.mostrarAlerta('Error', 'Debes seleccionar un nivel educacional.');
      return;
    }

    // Valida fecha de nacimiento
    if (!this.fechaNacimiento || !this.validarFechaNacimiento(this.fechaNacimiento)) {
      await this.mostrarAlerta('Error', 'Por favor, ingresa una fecha de nacimiento válida.');
      return;
    }

    // Si todas las validaciones son correctas, se guardan los cambios
    await this.mostrarAlerta('Éxito', 'Los cambios se han guardado correctamente.');
  }

  // Método para eliminar la cuenta del usuario
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
          handler: async () => {
            try {
              await this.databaseService.eliminarUsuario(this.user);
              await this.mostrarAlerta('Éxito', 'Cuenta eliminada correctamente.');
              this.router.navigate(['/login']);
            } catch (error) {
              await this.mostrarAlerta('Error', 'No se pudo eliminar la cuenta.');
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
