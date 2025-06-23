import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ProfileImageService } from 'src/app/services/profile-image.service';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
  standalone: false
})

export class CamaraPage implements OnInit {
  imageSource: any;

  constructor(private profileImageService: ProfileImageService) { }

  ngOnInit() {
    // Cargar imagen guardada si existe
    this.imageSource = this.profileImageService.loadProfileImage();
  }

  // Toma una foto usando la cámara
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    this.imageSource = image.dataUrl;
  }

  // Selecciona una imagen de la galería
  async selectFromGallery() {
    const image = await this.profileImageService.selectFromGallery();
    if (image) {
      this.imageSource = image;
    }
  }

  // Guarda la imagen seleccionada o tomada
  saveImage() {
    if (this.imageSource) {
      this.profileImageService.saveProfileImage(this.imageSource);
    }
  }

  // Elimina la imagen de perfil
  clearImage() {
    this.profileImageService.removeProfileImage();
    this.imageSource = null;
  }
}
