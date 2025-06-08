import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

interface Manga {
  nombre: string;
  volumen: string;
  autor: string;
  genero: string;
  sinopsis: string;
  imagen: string;
}

@Component({
  selector: 'app-detalle-manga',
  templateUrl: './detalle-manga.page.html',
  styleUrls: ['./detalle-manga.page.scss'],
  standalone: false
})
export class DetalleMangaPage implements OnInit {
  manga: Manga | undefined;
  esDeMangateca: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // Se obtienen los datos del manga desde el estado de la navegación
    const navigation = window.history.state;
    if (navigation && navigation.manga) {
      this.manga = navigation.manga;
      // Verificamos si el manga viene de la mangateca
      this.esDeMangateca = navigation.fromMangateca || false;
    }
  }

  quitarDeColeccion() {
    // Aquí irá próximamente la lógica para quitar el manga de la colección
    // Por ahora solo retornará a la página anterior
    this.navCtrl.back();
  }
}
