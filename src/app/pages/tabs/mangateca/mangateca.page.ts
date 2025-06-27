import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { DatabaseServiceService } from '../../../services/database-service.service';
import { Manga } from '../../../components/manga-card/manga-card.component';

@Component({
  selector: 'app-mangateca',
  templateUrl: './mangateca.page.html',
  styleUrls: ['./mangateca.page.scss'],
  standalone: false,
})
export class MangatecaPage implements OnInit {

  // Listado de mangas en mi colección
  miColeccion: Manga[] = [];
  currentUsername: string = '';

  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseServiceService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarColeccion();
  }

  ionViewWillEnter() {
    this.currentUsername = localStorage.getItem('username') || '';
    this.cargarColeccion();
  }

  // Método que carga la colección de mangas del usuario
  async cargarColeccion() {
    try {
      if (this.currentUsername) {
        // Obtener mangas de la colección personal del usuario
        this.miColeccion = await this.databaseService.obtenerMangasUsuario(this.currentUsername, 'coleccion');
        
        // Marcar todos como en colección
        for (const manga of this.miColeccion) {
          (manga as any).isInCollection = true;
          (manga as any).isInWishlist = await this.databaseService.mangaEnLista(this.currentUsername, manga.id!, 'wishlist');
        }
      } else {
        // Si no hay usuario logueado, mostrar mangas de ejemplo
        this.miColeccion = await this.databaseService.obtenerMangasPorCategoria('coleccion');
        for (const manga of this.miColeccion) {
          (manga as any).isInCollection = false;
          (manga as any).isInWishlist = false;
        }
      }
    } catch (error) {
      console.error('Error al cargar colección:', error);
    }
  }

  // Método que muestra una alerta si el usuario no está logueado
  async mostrarAlertaLogin() {
    const alert = await this.alertController.create({
      header: 'Iniciar sesión requerido',
      message: 'Debes iniciar sesión para agregar mangas a tus listas personales.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ir al login',
          handler: () => {
            this.navCtrl.navigateForward('/login');
          }
        }
      ]
    });
    await alert.present();
  }

  // Método para navegar a la página de detalle del manga
  verDetalleManga(manga: Manga) {
    this.navCtrl.navigateForward('/detalle-manga', {
      state: { 
        manga,
        fromMangateca: true
      }
    });
  }

  // Método para agregar un manga a la wishlist del usuario
  async agregarAWishlist(manga: Manga) {
    if (!this.currentUsername) {
      await this.mostrarAlertaLogin();
      return;
    }

    if (manga.id) {
      try {
        await this.databaseService.agregarMangaUsuario(this.currentUsername, manga.id, 'wishlist');
        (manga as any).isInWishlist = true;
      } catch (error) {
        console.error('Error al agregar a wishlist:', error);
      }
    }
  }

  // Método para quitar un manga de la colección del usuario
  async quitarDeColeccion(manga: Manga) {
    if (manga.id) {
      try {
        await this.databaseService.quitarMangaUsuario(this.currentUsername, manga.id, 'coleccion');
        // Remover de la lista local
        this.miColeccion = this.miColeccion.filter(m => m.id !== manga.id);
      } catch (error) {
        console.error('Error al quitar de colección:', error);
      }
    }
  }

  // Método para quitar un manga de la wishlist del usuario
  async quitarDeWishlist(manga: Manga) {
    if (manga.id) {
      try {
        await this.databaseService.quitarMangaUsuario(this.currentUsername, manga.id, 'wishlist');
        (manga as any).isInWishlist = false;
      } catch (error) {
        console.error('Error al quitar de wishlist:', error);
      }
    }
  }
}
