import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, AlertController } from '@ionic/angular';
import { DatabaseServiceService } from '../services/database-service.service';
import { Manga } from '../components/manga-card/manga-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage implements OnInit {
  username: string = '';
  showWelcomeMessage: boolean = true;
  mangas: Manga[] = [];

  constructor(
    private router: Router,
    private menu: MenuController,
    private navCtrl: NavController,
    private databaseService: DatabaseServiceService,
    private alertController: AlertController
  ) {
    // Obtener el username del estado de la navegación (solo al iniciar sesión)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.username = (navigation.extras.state as any).username;
    }
  }

  ngOnInit() {
    // Obtener el username del localStorage si no se obtuvo del estado de navegación
    if (!this.username) {
      this.username = localStorage.getItem('username') || '';
    }
    
    this.cargarMangas();
    
    // Oculta el mensaje de bienvenida después de 5 segundos
    setTimeout(() => {
      this.showWelcomeMessage = false;
    }, 5000);
  }

  ionViewWillEnter() {
    // Obtener el username del localStorage cada vez que se entra a la página
    this.username = localStorage.getItem('username') || '';
    this.cargarMangas();
  }

  // Método para cargar los mangas desde la base de datos
  async cargarMangas() {
    try {
      // Obtener todos los mangas de todas las categorías desde la base de datos
      this.mangas = await this.databaseService.obtenerTodosLosMangas();
      
      // Si hay un usuario logueado, verificar el estado de cada manga en sus listas
      if (this.username) {
        await this.actualizarEstadoMangas();
      }
    } catch (error) {
      console.error('Error al cargar mangas:', error);
    }
  }

  // Método que actualiza el estado de los mangas (si están en colección o wishlist)
  async actualizarEstadoMangas() {
    for (const manga of this.mangas) {
      if (manga.id) {
        // Verificar si está en colección
        const enColeccion = await this.databaseService.mangaEnLista(this.username, manga.id, 'coleccion');
        // Verificar si está en wishlist
        const enWishlist = await this.databaseService.mangaEnLista(this.username, manga.id, 'wishlist');
        
        // Agregar propiedades al objeto manga
        (manga as any).isInCollection = enColeccion;
        (manga as any).isInWishlist = enWishlist;
      }
    }
  }

  // Muestra una alerta si el usuario no está logueado al intentar agregar un manga
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

  // Navega a la página de detalles del manga seleccionado
  verDetalleManga(manga: Manga) {
    this.navCtrl.navigateForward('/detalle-manga', {
      state: { manga }
    });
  }

  // Agrega un manga a la colección del usuario
  async agregarAColeccion(manga: Manga) {
    if (!this.username) {
      await this.mostrarAlertaLogin();
      return;
    }

    if (manga.id) {
      try {
        await this.databaseService.agregarMangaUsuario(this.username, manga.id, 'coleccion');
        (manga as any).isInCollection = true;
      } catch (error) {
        console.error('Error al agregar a colección:', error);
      }
    }
  }

  // Agrega un manga a la wishlist del usuario
  async agregarAWishlist(manga: Manga) {
    if (!this.username) {
      await this.mostrarAlertaLogin();
      return;
    }

    if (manga.id) {
      try {
        await this.databaseService.agregarMangaUsuario(this.username, manga.id, 'wishlist');
        (manga as any).isInWishlist = true;
      } catch (error) {
        console.error('Error al agregar a wishlist:', error);
      }
    }
  }

  // Quita un manga de la colección del usuario
  async quitarDeColeccion(manga: Manga) {
    if (manga.id) {
      try {
        await this.databaseService.quitarMangaUsuario(this.username, manga.id, 'coleccion');
        (manga as any).isInCollection = false;
      } catch (error) {
        console.error('Error al quitar de colección:', error);
      }
    }
  }

  // Quita un manga de la wishlist del usuario
  async quitarDeWishlist(manga: Manga) {
    if (manga.id) {
      try {
        await this.databaseService.quitarMangaUsuario(this.username, manga.id, 'wishlist');
        (manga as any).isInWishlist = false;
      } catch (error) {
        console.error('Error al quitar de wishlist:', error);
      }
    }
  }
}
