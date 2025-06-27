import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { DatabaseServiceService } from '../../services/database-service.service';
import { Manga } from '../../components/manga-card/manga-card.component';

@Component({
  selector: 'app-detalle-manga',
  templateUrl: './detalle-manga.page.html',
  styleUrls: ['./detalle-manga.page.scss'],
  standalone: false
})

export class DetalleMangaPage implements OnInit {
  manga: Manga | undefined;
  esDeMangateca: boolean = false;
  esDeWishlist: boolean = false;
  currentUsername: string = '';
  isInCollection: boolean = false;
  isInWishlist: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private databaseService: DatabaseServiceService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.currentUsername = localStorage.getItem('username') || '';
    
    // Se obtienen los datos del manga desde el estado de la navegación
    const navigation = window.history.state;
    if (navigation && navigation.manga) {
      this.manga = navigation.manga;
      // Verificamos si el manga viene de la mangateca o wishlist
      this.esDeMangateca = navigation.fromMangateca || false;
      this.esDeWishlist = navigation.fromWishlist || false;
      
      // Verificar el estado actual del manga en las listas del usuario
      this.verificarEstadoManga();
    }
  }

  ionViewWillEnter() {
    this.currentUsername = localStorage.getItem('username') || '';
    if (this.manga) {
      this.verificarEstadoManga();
    }
  }

  // Método para verificar si el manga está en la colección o wishlist del usuario
  async verificarEstadoManga() {
    if (this.manga?.id && this.currentUsername) {
      try {
        this.isInCollection = await this.databaseService.mangaEnLista(this.currentUsername, this.manga.id, 'coleccion');
        this.isInWishlist = await this.databaseService.mangaEnLista(this.currentUsername, this.manga.id, 'wishlist');
      } catch (error) {
        console.error('Error al verificar estado del manga:', error);
      }
    }
  }

  // Método que muestra una alerta si el usuario no está logueado
  async showLoginAlert() {
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

  // Método para agregar manga a la colección del usuario
  async agregarAColeccion() {
    if (!this.currentUsername) {
      await this.showLoginAlert();
      return;
    }

    if (this.manga?.id) {
      try {
        await this.databaseService.agregarMangaUsuario(this.currentUsername, this.manga.id, 'coleccion');
        this.isInCollection = true;
        this.esDeMangateca = true;
      } catch (error) {
        console.error('Error al agregar a colección:', error);
      }
    }
  }

  // Método para agregar manga a la wishlist del usuario
  async agregarAWishlist() {
    if (!this.currentUsername) {
      await this.showLoginAlert();
      return;
    }

    if (this.manga?.id) {
      try {
        await this.databaseService.agregarMangaUsuario(this.currentUsername, this.manga.id, 'wishlist');
        this.isInWishlist = true;
        this.esDeWishlist = true;
      } catch (error) {
        console.error('Error al agregar a wishlist:', error);
      }
    }
  }

  // Método para quitar manga de la colección del usuario
  async quitarDeColeccion() {
    if (this.manga?.id) {
      try {
        await this.databaseService.quitarMangaUsuario(this.currentUsername, this.manga.id, 'coleccion');
        this.isInCollection = false;
        this.esDeMangateca = false;
      } catch (error) {
        console.error('Error al quitar de colección:', error);
      }
    }
  }

  // Método para quitar manga de la wishlist del usuario
  async quitarDeWishlist() {
    if (this.manga?.id) {
      try {
        await this.databaseService.quitarMangaUsuario(this.currentUsername, this.manga.id, 'wishlist');
        this.isInWishlist = false;
        this.esDeWishlist = false;
      } catch (error) {
        console.error('Error al quitar de wishlist:', error);
      }
    }
  }
}
