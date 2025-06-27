import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { DatabaseServiceService } from '../../../services/database-service.service';
import { Manga } from '../../../components/manga-card/manga-card.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  standalone: false,
})
export class WishlistPage implements OnInit {

  // Listado de mangas en wishlist
  wishlist: Manga[] = [];
  currentUsername: string = '';

  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseServiceService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarWishlist();
  }

  ionViewWillEnter() {
    this.currentUsername = localStorage.getItem('username') || '';
    this.cargarWishlist();
  }

  // Método que carga la wishlist de mangas del usuario
  async cargarWishlist() {
    try {
      if (this.currentUsername) {
        // Obtener mangas de la wishlist personal del usuario
        this.wishlist = await this.databaseService.obtenerMangasUsuario(this.currentUsername, 'wishlist');
        
        // Marcar todos como en wishlist
        for (const manga of this.wishlist) {
          (manga as any).isInWishlist = true;
          (manga as any).isInCollection = await this.databaseService.mangaEnLista(this.currentUsername, manga.id!, 'coleccion');
        }
      } else {
        // Si no hay usuario logueado, mostrar mangas de ejemplo
        this.wishlist = await this.databaseService.obtenerMangasPorCategoria('wishlist');
        for (const manga of this.wishlist) {
          (manga as any).isInWishlist = false;
          (manga as any).isInCollection = false;
        }
      }
    } catch (error) {
      console.error('Error al cargar wishlist:', error);
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

  // Método para navegar a la página de detalle del manga desde la wishlist
  verDetalleManga(manga: Manga) {
    this.navCtrl.navigateForward('/detalle-manga', {
      state: { 
        manga,
        fromWishlist: true
      }
    });
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

  // Método para quitar un manga de la wishlist del usuario
  async quitarDeWishlist(manga: Manga) {
    if (manga.id) {
      try {
        await this.databaseService.quitarMangaUsuario(this.currentUsername, manga.id, 'wishlist');
        // Remover de la lista local
        this.wishlist = this.wishlist.filter(m => m.id !== manga.id);
      } catch (error) {
        console.error('Error al quitar de wishlist:', error);
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
}
