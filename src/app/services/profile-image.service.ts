import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {

  constructor(private alertController: AlertController) { }

  // Carga la imagen de perfil guardada
  loadProfileImage(): string | null {
    return localStorage.getItem('profileImage');
  }

  // Guarda la imagen de perfil
  saveProfileImage(imageDataUrl: string): void {
    localStorage.setItem('profileImage', imageDataUrl);
  }

  // Elimina la imagen de perfil
  removeProfileImage(): void {
    localStorage.removeItem('profileImage');
  }

  // Toma una foto usando la cámara
  async takePicture(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      await this.showAlert('Error', 'No se pudo tomar la foto. Verifica los permisos de cámara.');
      return null;
    }
  }

  // Selecciona una imagen de la galería
  async selectFromGallery(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      await this.showAlert('Error', 'No se pudo seleccionar la imagen. Verifica los permisos de galería.');
      return null;
    }
  }

  // Método que muestra una alerta
  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
} 