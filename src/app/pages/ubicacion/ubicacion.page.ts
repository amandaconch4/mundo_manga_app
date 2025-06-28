import { Component } from '@angular/core';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
  standalone: false,
})

export class UbicacionPage {

  constructor(private menu: MenuController) { }

  // Método para obtener la ubicación actual del usuario
  async obtenerUbicacion() {
    try {
      // Verificar permisos de geolocalización
      const permisos: PermissionStatus = await Geolocation.checkPermissions();

      if (permisos.location !== 'granted') {
        const requestPermission = await Geolocation.requestPermissions();
        if (requestPermission.location !== 'granted') {
          console.error('Permiso de ubicación denegado');
          return;
        }
      }

      // Obtener la ubicación actual
      const posicion = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, });

      const latitud = posicion.coords.latitude;
      const longitud = posicion.coords.longitude;

      const mapUrl: HTMLIFrameElement | null = document.getElementById('mapa') as HTMLIFrameElement;

      if (mapUrl) {
        // Actualizar el src del iframe con la ubicación actual
        mapUrl.src = `https://www.google.com/maps?q=${latitud},${longitud}&output=embed`;
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }
}
