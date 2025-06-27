import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, AlertController } from '@ionic/angular';
import { DatabaseServiceService } from '../../../services/database-service.service';
import { Manga } from '../../../components/manga-card/manga-card.component';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.page.html',
  styleUrls: ['./novedades.page.scss'],
  standalone: false,
})
export class NovedadesPage implements OnInit {

  // Listado de mangas en novedades
  novedades: Manga[] = [];
  currentUsername: string = '';

  constructor(
    private menu: MenuController,
    private navCtrl: NavController,
    private databaseService: DatabaseServiceService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarNovedades();
  }

  ionViewWillEnter() {
    this.currentUsername = localStorage.getItem('username') || '';
    this.cargarNovedades();
  }

  // Método que carga los mangas de novedades
  async cargarNovedades() {
    try {
      // Obtener mangas de novedades desde la base de datos
      this.novedades = await this.databaseService.obtenerMangasPorCategoria('novedades');
      
      // Si hay un usuario logueado, verificar el estado de cada manga en sus listas
      if (this.currentUsername) {
        await this.actualizarEstadoMangas();
      }
    } catch (error) {
      console.error('Error al cargar novedades:', error);
    }
  }

  // Método que actualiza el estado de los mangas (si están en colección o wishlist)
  async actualizarEstadoMangas() {
    for (const manga of this.novedades) {
      if (manga.id) {
        // Verificar si está en colección
        const enColeccion = await this.databaseService.mangaEnLista(this.currentUsername, manga.id, 'coleccion');
        // Verificar si está en wishlist
        const enWishlist = await this.databaseService.mangaEnLista(this.currentUsername, manga.id, 'wishlist');
        
        // Agregar propiedades al objeto manga
        (manga as any).isInCollection = enColeccion;
        (manga as any).isInWishlist = enWishlist;
      }
    }
  }

  // Método para navegar a la página de detalle del manga
  verDetalleManga(manga: Manga) {
    this.navCtrl.navigateForward('/detalle-manga', {
      state: { manga }
    });
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

  // Método para agregar un manga a la colección del usuario
  async agregarAColeccion(manga: Manga) {
    if (!this.currentUsername) {
      await this.mostrarAlertaLogin();
      return;
    }

    if (manga.id) {
      try {
        await this.databaseService.agregarMangaUsuario(this.currentUsername, manga.id, 'coleccion');
        (manga as any).isInCollection = true;
      } catch (error) {
        console.error('Error al agregar a colección:', error);
      }
    }
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
        (manga as any).isInCollection = false;
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
